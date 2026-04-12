import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import QRCode from 'qrcode';
import {
  Circle,
  LayersControl,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  ScaleControl,
  TileLayer,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { authApi } from '../../features/auth/services/authApi';
import { clientApi } from '../../features/clients/services/clientApi';
import type { Client } from '../../features/clients/types/client.types';
import { packApi } from '../../features/packs/services/packApi';
import type { Pack } from '../../features/packs/types/pack.types';
import { paiementApi } from '../../features/paiements/services/paiementApi';
import { packGarantieApi } from '../../features/garanties/services/packGarantieApi';
import type { PackGarantie } from '../../features/garanties/types/packGarantie.types';
import { souscriptionApi } from '../../features/souscriptions/services/souscriptionApi';
import type { Souscription } from '../../features/souscriptions/types/souscription.types';
import { carteApi } from '../../features/cartes/services/carteApi';
import type { Carte } from '../../features/cartes/types/carte.types';
import { partenaireApi } from '../../features/partenaires/services/partenaireApi';
import type { Partenaire } from '../../features/partenaires/types/partenaire.types';
import RechargeCardModal from '../components/RechargeCardModal';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../shared/constants/routes';
import { ASSETS } from '../../shared/constants/assets';
import { formatFriendlyApiError } from '../../shared/utils/apiErrorMessages';

type Hospital = {
  id: string;
  label: string;
  name: string;
  position: [number, number];
  address: string;
  distanceKm: number | null;
  telephone?: string | null;
};

type GuaranteeDisplayItem = {
  id: string;
  label: string;
};

type DeviceOrientationEventWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

const EARTH_RADIUS_KM = 6371;

const toRadians = (value: number) => (value * Math.PI) / 180;
const toDegrees = (value: number) => (value * 180) / Math.PI;

const getDistanceKm = (from: [number, number], to: [number, number]) => {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getBearing = (from: [number, number], to: [number, number]) => {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const y = Math.sin(toRadians(lng2 - lng1)) * Math.cos(toRadians(lat2));
  const x =
    Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
    Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(toRadians(lng2 - lng1));

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
};

const bearingToCardinal = (bearing: number) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};

const formatDistanceKm = (distanceKm: number | null) => {
  if (distanceKm === null || Number.isNaN(distanceKm)) {
    return 'Distance N/A';
  }

  return `${distanceKm.toFixed(1)} km`;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const angleDiff = (a: number, b: number) => {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const formatCurrencyAmount = (value: number) =>
  new Intl.NumberFormat('fr-FR').format(value).replace(/\u202f/g, ' ');

const normalizePackValue = (value?: string | null) =>
  value
    ? value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\bpack\b/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : '';

const matchesPackValue = (candidate: string, reference?: string | null) => {
  const normalizedCandidate = normalizePackValue(candidate);
  const normalizedReference = normalizePackValue(reference);

  if (!normalizedCandidate || !normalizedReference) {
    return false;
  }

  return (
    normalizedCandidate === normalizedReference ||
    normalizedCandidate.includes(normalizedReference) ||
    normalizedReference.includes(normalizedCandidate)
  );
};

const isImageSource = (value: string) => /^(data:image\/|https?:\/\/|\/)/i.test(value);

type DigitalQrCodeProps = {
  qrCode?: string | null;
  payload: string;
  label: string;
};

const DigitalQrCode: FC<DigitalQrCodeProps> = ({ qrCode, payload, label }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;

    const resolveQr = async () => {
      setStatus('loading');

      if (qrCode?.trim()) {
        if (isImageSource(qrCode.trim())) {
          if (active) {
            setSrc(qrCode.trim());
            setStatus('ready');
          }
          return;
        }

        try {
          const generated = await QRCode.toDataURL(qrCode.trim(), {
            errorCorrectionLevel: 'M',
            margin: 1,
            width: 220,
            color: {
              dark: '#06143a',
              light: '#ffffff',
            },
          });

          if (active) {
            setSrc(generated);
            setStatus('ready');
          }
          return;
        } catch {
          // Fallback to payload below.
        }
      }

      try {
        const generated = await QRCode.toDataURL(payload, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 220,
          color: {
            dark: '#06143a',
            light: '#ffffff',
          },
        });

        if (active) {
          setSrc(generated);
          setStatus('ready');
        }
      } catch {
        if (active) {
          setSrc(null);
          setStatus('error');
        }
      }
    };

    void resolveQr();

    return () => {
      active = false;
    };
  }, [payload, qrCode]);

  return (
    <div className="client-card__qr">
      <div className="client-card__qr-frame">
        {status === 'ready' && src ? (
          <img src={src} alt={label} className="client-card__qr-image" />
        ) : (
          <div className="client-card__qr-fallback">
            {status === 'error' ? 'QR indisponible' : 'Génération du QR...'}
          </div>
        )}
      </div>
      <p className="client-card__qr-caption">Présentez ce QR à l’accueil</p>
    </div>
  );
};

const fallbackHospitals: Hospital[] = [
  {
    id: 'h1',
    label: 'Hopital',
    name: 'Hopital Principal de Dakar',
    position: [14.6708, -17.4352],
    address: 'Avenue Nelson Mandela, Dakar',
    distanceKm: 1.8,
  },
  {
    id: 'h2',
    label: 'Hopital',
    name: 'Centre Hospitalier National de Fann',
    position: [14.6924, -17.4552],
    address: 'Fann Residence, Dakar',
    distanceKm: 2.9,
  },
  {
    id: 'h3',
    label: 'Hopital',
    name: 'Hopital Aristide Le Dantec',
    position: [14.6732, -17.4385],
    address: 'Avenue Pasteur, Dakar',
    distanceKm: 3.4,
  },
];

const isHospitalPartner = (type: string) => {
  const normalized = type.trim().toLowerCase();
  return normalized.includes('hop') || normalized.includes('hospital') || normalized.includes('centre');
};

const toHospital = (partner: Partenaire, userPosition: [number, number] | null): Hospital | null => {
  if (typeof partner.latitude !== 'number' || typeof partner.longitude !== 'number') {
    return null;
  }

  return {
    id: partner.id,
    label: partner.type?.trim() ? partner.type.trim() : 'Hopital',
    name: partner.nom,
    position: [partner.latitude, partner.longitude],
    address: partner.adresse?.trim() || 'Adresse indisponible',
    distanceKm: userPosition ? getDistanceKm(userPosition, [partner.latitude, partner.longitude]) : partner.distanceKm ?? null,
    telephone: partner.telephone ?? null,
  };
};

const hospitalKey = (hospital: Hospital) =>
  [
    hospital.name.trim().toLowerCase(),
    hospital.address.trim().toLowerCase(),
    hospital.position[0].toFixed(5),
    hospital.position[1].toFixed(5),
  ].join('|');

const uniqueHospitals = (hospitals: Hospital[]) => {
  const seen = new Set<string>();

  return hospitals.filter((hospital) => {
    const key = hospitalKey(hospital);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const RECHARGE_DEFAULT_FEATURES: GuaranteeDisplayItem[] = [
  { id: 'recharge-feature-1', label: 'Tout inclus' },
  { id: 'recharge-feature-2', label: 'Hospitalisation' },
  { id: 'recharge-feature-3', label: 'Vision' },
  { id: 'recharge-feature-4', label: 'Service VIP' },
  { id: 'recharge-feature-5', label: 'Soins dentaires' },
  { id: 'recharge-feature-6', label: 'Assistance santé' },
];

const getHospitalMarkerIcon = (hospital: Hospital, isSelected: boolean) => {
  const badge = isSelected ? 'HOPITAL CHOISI' : 'HOPITAL';
  const subtitle = hospital.name.length > 30 ? `${hospital.name.slice(0, 27)}...` : hospital.name;
  const iconWidth = isSelected ? 128 : 112;
  const iconHeight = isSelected ? 68 : 60;
  const anchorX = Math.round(iconWidth / 2);
  const anchorY = iconHeight - 4;

  return L.divIcon({
    className: 'hospital-sticker-wrap',
    html: `
      <div class="hospital-sticker${isSelected ? ' hospital-sticker--selected' : ''}">
        <div class="hospital-sticker__badge">${escapeHtml(badge)}</div>
        <div class="hospital-sticker__name">${escapeHtml(subtitle)}</div>
        <div class="hospital-sticker__pin">
          <span></span>
        </div>
      </div>
    `,
    iconSize: [iconWidth, iconHeight],
    iconAnchor: [anchorX, anchorY],
    popupAnchor: [0, -52],
  });
};

const getUserArrowIcon = (isHeadingCorrect: boolean | null) => {
  const dotColor = isHeadingCorrect === null ? '#0a6cff' : isHeadingCorrect ? '#16a34a' : '#dc2626';

  return L.divIcon({
    className: 'user-direction-icon',
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <style>
          @keyframes msUserPulse {
            0% { transform: scale(0.9); opacity: 0.8; }
            70% { transform: scale(1.5); opacity: 0; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        </style>
        <div style="
          position: absolute;
          left: 4px;
          top: 4px;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: rgba(10, 108, 255, 0.22);
          animation: msUserPulse 1.6s infinite;
        "></div>
        <div style="
          position: absolute;
          left: 6px;
          top: 6px;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: ${dotColor};
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 2px rgba(10, 108, 255, 0.22);
        ">
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const MapFitBounds: FC<{
  userPosition: [number, number] | null;
  hospitalPosition: [number, number];
  routeCoords: [number, number][];
  isCompactMap: boolean;
}> = ({ userPosition, hospitalPosition, routeCoords, isCompactMap }) => {
  const map = useMap();

  useEffect(() => {
    if (isCompactMap) {
      return;
    }

    const points = routeCoords.length > 1
      ? routeCoords
      : userPosition
        ? [userPosition, hospitalPosition]
        : [hospitalPosition];

    if (points.length === 1) {
      map.flyTo(points[0], 15, { duration: 0.7 });
      return;
    }

    map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
  }, [map, userPosition, hospitalPosition, routeCoords, isCompactMap]);

  return null;
};

const MapFollowUser: FC<{ userPosition: [number, number] | null; isCompactMap: boolean }> = ({ userPosition, isCompactMap }) => {
  const map = useMap();
  const didInitRef = useRef(false);

  useEffect(() => {
    if (!userPosition) return;

    if (!didInitRef.current) {
      map.setView(userPosition, 16, { animate: true });
      didInitRef.current = true;
      return;
    }

    if (isCompactMap) {
      return;
    }

    map.flyTo(userPosition, map.getZoom(), { duration: 0.7 });
  }, [map, userPosition, isCompactMap]);

  return null;
};

const ClientSpacePage: FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [hospitalCandidates, setHospitalCandidates] = useState<Hospital[]>(fallbackHospitals);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [distanceToHospitalKm, setDistanceToHospitalKm] = useState<number | null>(null);
  const [locationAccuracyM, setLocationAccuracyM] = useState<number | null>(null);
  const [speedKmh, setSpeedKmh] = useState<number | null>(null);
  const [targetBearing, setTargetBearing] = useState<number | null>(null);
  const [movementBearing, setMovementBearing] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isHeadingCorrect, setIsHeadingCorrect] = useState<boolean | null>(null);
  const [movementTrail, setMovementTrail] = useState<[number, number][]>([]);
  const previousUserPositionRef = useRef<[number, number] | null>(null);
  const lastHospitalQueryCenterRef = useRef<[number, number] | null>(null);
  const lastUserPositionRef = useRef<[number, number] | null>(null);
  const [isCompactMap, setIsCompactMap] = useState(false);

  const selectedHospital = useMemo(
    () => hospitalCandidates.find((hospital) => hospital.id === selectedHospitalId) ?? hospitalCandidates[0] ?? fallbackHospitals[0],
    [hospitalCandidates, selectedHospitalId]
  );
  const topHospitals = useMemo(() => hospitalCandidates.slice(0, 3), [hospitalCandidates]);
  const userArrowIcon = useMemo(
    () => getUserArrowIcon(isHeadingCorrect),
    [isHeadingCorrect]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const syncIsCompactMap = () => {
      setIsCompactMap(mediaQuery.matches);
    };

    syncIsCompactMap();
    mediaQuery.addEventListener('change', syncIsCompactMap);
    return () => {
      mediaQuery.removeEventListener('change', syncIsCompactMap);
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocationError('La geolocalisation nest pas supportee par votre navigateur.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
        const lastKnownPosition = lastUserPositionRef.current;
        const movedKm = lastKnownPosition ? getDistanceKm(lastKnownPosition, nextPosition) : Number.POSITIVE_INFINITY;
        const minMoveKm = isCompactMap ? 0.03 : 0.01;

        if (lastKnownPosition && movedKm < minMoveKm) {
          return;
        }

        lastUserPositionRef.current = nextPosition;
        setUserPosition(nextPosition);
        setLocationAccuracyM(position.coords.accuracy ?? null);
        setSpeedKmh(position.coords.speed !== null ? Math.max(position.coords.speed * 3.6, 0) : null);
        setMovementTrail((prev) => {
          if (prev.length === 0) return [nextPosition];

          const last = prev[prev.length - 1];
          const moved = getDistanceKm(last, nextPosition);
          if (moved < 0.003) return prev;

          const nextTrail = [...prev, nextPosition];
          return nextTrail.slice(-120);
        });
        setGeolocationError(null);
      },
      (error) => {
        setGeolocationError(error.message || 'Impossible de recuperer votre position exacte.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadHospitals = async () => {
      const queryCenter = userPosition;

      if (
        queryCenter &&
        lastHospitalQueryCenterRef.current &&
        getDistanceKm(lastHospitalQueryCenterRef.current, queryCenter) < 0.5
      ) {
        return;
      }

      setIsLoadingHospitals(true);

      try {
        const data = queryCenter
          ? await partenaireApi.list({ lat: queryCenter[0], lon: queryCenter[1] })
          : await partenaireApi.list();

        const hospitals = data
          .filter((partner) => partner.actif !== false)
          .filter((partner) => isHospitalPartner(partner.type))
          .map((partner) => toHospital(partner, queryCenter))
          .filter((hospital): hospital is Hospital => Boolean(hospital))
          .sort((a, b) => {
            const aDistance = a.distanceKm ?? Number.POSITIVE_INFINITY;
            const bDistance = b.distanceKm ?? Number.POSITIVE_INFINITY;
            return aDistance - bDistance;
          });

        const mergedCandidates = uniqueHospitals([
          ...hospitals,
          ...fallbackHospitals.map((hospital) => ({
            ...hospital,
            distanceKm: queryCenter ? getDistanceKm(queryCenter, hospital.position) : hospital.distanceKm,
          })),
        ]).sort((a, b) => {
          const aDistance = a.distanceKm ?? Number.POSITIVE_INFINITY;
          const bDistance = b.distanceKm ?? Number.POSITIVE_INFINITY;
          return aDistance - bDistance;
        });

        if (isMounted && mergedCandidates.length > 0) {
          setHospitalCandidates(mergedCandidates.slice(0, 3));
          lastHospitalQueryCenterRef.current = queryCenter;
          return;
        }
      } catch {
        // fallback below
      } finally {
        if (isMounted) {
          setIsLoadingHospitals(false);
        }
      }

      const fallback = fallbackHospitals
        .map((hospital) => ({
          ...hospital,
          distanceKm: queryCenter ? getDistanceKm(queryCenter, hospital.position) : hospital.distanceKm,
        }))
        .filter((hospital) => uniqueHospitals([hospital]).length > 0)
        .sort((a, b) => {
          const aDistance = a.distanceKm ?? Number.POSITIVE_INFINITY;
          const bDistance = b.distanceKm ?? Number.POSITIVE_INFINITY;
          return aDistance - bDistance;
        });

      if (isMounted) {
        setHospitalCandidates(fallback.slice(0, 3));
        lastHospitalQueryCenterRef.current = queryCenter;
      }
    };

    void loadHospitals();

    return () => {
      isMounted = false;
    };
  }, [userPosition]);

  useEffect(() => {
    if (topHospitals.length === 0) {
      setSelectedHospitalId(null);
      return;
    }

    setSelectedHospitalId((current) => {
      if (current && topHospitals.some((hospital) => hospital.id === current)) {
        return current;
      }

      return topHospitals[0].id;
    });
  }, [topHospitals]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEventWithCompass) => {
      let heading: number | null = null;

      if (typeof event.webkitCompassHeading === 'number') {
        heading = event.webkitCompassHeading;
      } else if (typeof event.alpha === 'number') {
        heading = (360 - event.alpha + 360) % 360;
      }

      if (heading !== null) {
        setDeviceHeading(heading);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation as EventListener);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!userPosition) {
      setDistanceToHospitalKm(null);
      setTargetBearing(null);
      setMovementBearing(null);
      setIsHeadingCorrect(null);
      previousUserPositionRef.current = null;
      return;
    }

    const destination = selectedHospital.position;
    const target = getBearing(userPosition, destination);
    const distance = getDistanceKm(userPosition, destination);

    setTargetBearing(target);
    setDistanceToHospitalKm(distance);

    const previous = previousUserPositionRef.current;
    if (previous) {
      const movement = getBearing(previous, userPosition);
      const currentHeading = deviceHeading ?? movement;
      const headingDiff = angleDiff(currentHeading, target);
      setMovementBearing(movement);
      setIsHeadingCorrect(headingDiff <= 45);
    }

    previousUserPositionRef.current = userPosition;
  }, [userPosition, selectedHospital, deviceHeading]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!userPosition) {
        setRouteCoords([]);
        return;
      }

      setIsLoadingRoute(true);
      try {
        const [userLat, userLng] = userPosition;
        const [hospitalLat, hospitalLng] = selectedHospital.position;
        const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${hospitalLng},${hospitalLat}?overview=full&geometries=geojson`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Routing service error');
        }

        const data = await response.json();
        const coordinates = data?.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined;
        if (!coordinates || coordinates.length < 2) {
          throw new Error('No route found');
        }

        setRouteCoords(coordinates.map(([lng, lat]) => [lat, lng]));
      } catch {
        setRouteCoords([userPosition, selectedHospital.position]);
      } finally {
        setIsLoadingRoute(false);
      }
    };

    void fetchRoute();
  }, [userPosition, selectedHospital]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout API errors
    }
    logout();
    navigate(ROUTES.login);
  };

  const [clientProfile, setClientProfile] = useState<Client | null>(null);
  const [garanties, setGaranties] = useState<PackGarantie[]>([]);
  const [activeSouscription, setActiveSouscription] = useState<Souscription | null>(null);
  const [currentPack, setCurrentPack] = useState<Pack | null>(null);
  const [packLabel, setPackLabel] = useState<string | null>(null);
  const [carte, setCarte] = useState<Carte | null>(null);
  const [rechargeModalStep, setRechargeModalStep] = useState<'summary' | 'wave' | null>(null);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [rechargeError, setRechargeError] = useState<string | null>(null);
  const fullName = useAuthStore((s) => s.fullName);

  useEffect(() => {
    let isMounted = true;
    clientApi
      .getMe()
      .then((data) => {
        if (isMounted) setClientProfile(data);
      })
      .catch(() => {
        if (isMounted) setClientProfile(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchGaranties = async () => {
      if (!clientProfile) {
        if (isMounted) setGaranties([]);
        if (isMounted) setActiveSouscription(null);
        if (isMounted) setPackLabel(null);
        if (isMounted) setCurrentPack(null);
        return;
      }

      let packId: string | null = null;
      try {
        const souscriptions = await souscriptionApi.list();
        const active = souscriptions.find(
          (s) => s.clientId === clientProfile.id && s.statut === 'ACTIVE'
        );
        const fallback = souscriptions.find((s) => s.clientId === clientProfile.id);
        const selected = active ?? fallback ?? null;
        packId = selected?.packId ?? null;
        if (isMounted) setActiveSouscription(selected);
      } catch {
        packId = null;
        if (isMounted) setActiveSouscription(null);
      }

      let resolvedPack: Pack | null = null;
      try {
        const packs = await packApi.list();

        if (packId) {
          resolvedPack = packs.find((pack) => pack.id === packId) ?? null;
        }

        if (!resolvedPack && clientProfile.typeAssurance) {
          resolvedPack =
            packs.find(
              (pack) =>
                matchesPackValue(pack.nom, clientProfile.typeAssurance) ||
                matchesPackValue(pack.code, clientProfile.typeAssurance),
            ) ?? null;
          if (resolvedPack) {
            packId = resolvedPack.id;
          }
        }

        if (!resolvedPack && packId) {
          resolvedPack = packs.find((pack) => pack.id === packId) ?? null;
        }
      } catch {
        resolvedPack = null;
      }

      if (isMounted) {
        setCurrentPack(resolvedPack);
        setPackLabel(resolvedPack?.nom ?? clientProfile.typeAssurance ?? null);
      }

      if (!packId) {
        if (isMounted) setGaranties([]);
        return;
      }

      try {
        const data = await packGarantieApi.listByPack(packId);
        if (isMounted) setGaranties(data);
      } catch {
        if (isMounted) setGaranties([]);
      }
    };

    void fetchGaranties();

    return () => {
      isMounted = false;
    };
  }, [clientProfile]);

  useEffect(() => {
    let isMounted = true;
    if (!activeSouscription?.id) {
      setCarte(null);
      return () => {
        isMounted = false;
      };
    }

    carteApi
      .getBySouscription(activeSouscription.id)
      .then((data) => {
        if (isMounted) setCarte(data);
      })
      .catch(() => {
        if (isMounted) setCarte(null);
      });

    return () => {
      isMounted = false;
    };
  }, [activeSouscription?.id]);

  const displayName = clientProfile ? `${clientProfile.prenom} ${clientProfile.nom}` : fullName ?? 'Client';
  const cardIsActive = carte?.statut === 'ACTIVATED';
  const cardStatus = cardIsActive ? 'active' : 'Inactive';
  const cardActionLabel = cardIsActive ? 'Telecharger votre carte' : 'Recharger votre carte';
  const cardPackLabel = packLabel ?? clientProfile?.typeAssurance ?? 'Pack sélectionné';
  const rechargePackId = currentPack?.id ?? activeSouscription?.packId ?? null;
  const rechargeTitle = currentPack?.nom ?? cardPackLabel;
  const rechargePriceLabel = currentPack
    ? `${formatCurrencyAmount(currentPack.prix)} FCFA`
    : 'Tarification indisponible';
  const rechargeAmountText = currentPack ? formatCurrencyAmount(currentPack.prix) : '';
  const cardValidity = formatDate(carte?.dateExpiration);
  const qrPayload = clientProfile?.numeroAssurance ?? carte?.numeroCarte ?? displayName;
  const guaranteeItems = useMemo<GuaranteeDisplayItem[]>(
    () =>
      garanties.length > 0
        ? garanties.map((garantie) => ({
            id: garantie.id,
            label: garantie.garantieLibelle,
          }))
        : RECHARGE_DEFAULT_FEATURES,
    [garanties],
  );

  const handleCardAction = () => {
    if (!cardIsActive) {
      setRechargeError(null);
      setRechargeModalStep('summary');
    }
  };

  const closeRechargeModal = () => {
    if (isInitiatingPayment) {
      return;
    }

    setRechargeModalStep(null);
    setRechargeError(null);
  };

  const handleProceedToWave = () => {
    if (!rechargePackId) {
      setRechargeError('Impossible de préparer le paiement pour ce pack.');
      return;
    }

    setRechargeError(null);
    setRechargeModalStep('wave');
  };

  const handleRechargeNow = async () => {
    if (!clientProfile || !rechargePackId) {
      setRechargeError('Impossible de préparer le paiement pour cette carte.');
      return;
    }

    setIsInitiatingPayment(true);
    setRechargeError(null);

    try {
      const response = await paiementApi.initierPaydunya({
        clientId: clientProfile.id,
        packId: rechargePackId,
      });

      setRechargeModalStep(null);
      window.location.assign(response.paymentUrl);
    } catch (error) {
      const friendly = formatFriendlyApiError(error);
      setRechargeError(friendly.message);
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  return (
    <div className="client-space">
      <header className="client-space__header">
        <img
          src={ASSETS.adminLogo}
          alt="MA Sante Assurance"
          className="client-space__logo"
        />
        <h1 className="client-space__title">Espace Client</h1>

        <div className="client-space__actions">
          <div className="client-space__user" aria-label={`Profil de ${displayName}`}>
            <span>{displayName}</span>
            {clientProfile?.photoUrl ? (
              <img src={clientProfile.photoUrl} alt={displayName} className="client-space__avatar" />
            ) : (
              <span className="client-space__avatar" aria-hidden="true" />
            )}
          </div>
          <button
            type="button"
            className="client-space__logout"
            onClick={handleLogout}
            title="Se deconnecter"
          >
            Deconnexion
          </button>
        </div>
      </header>

      <main className="client-space__content">
        <section className="client-space__grid">
          <article className={`client-card ${cardIsActive ? 'client-card--active' : 'client-card--inactive'}`}>
            <div className="client-card__top">
              <h2>Carte Digitale Assurance</h2>
              <span
                className={`client-card__status ${
                  cardIsActive ? 'client-card__status--active' : 'client-card__status--inactive'
                }`}
              >
                {cardStatus}
              </span>
            </div>

            <div className="client-card__body">
              <p>Nom : {displayName}</p>
              <p>Numéro Assurance : {clientProfile?.numeroAssurance ?? 'N/A'}</p>
              <p>Numéro Carte : {carte?.numeroCarte ?? 'N/A'}</p>
              <p>Formule : {cardPackLabel}</p>
              <p>Validité : {cardValidity}</p>
              <DigitalQrCode
                qrCode={carte?.qrCode}
                payload={qrPayload}
                label={`QR code assurance de ${displayName}`}
              />
            </div>

            <img
              src={ASSETS.adminLogo}
              alt="MA Sante Assurance"
              className="client-card__brand"
            />
            <img
              src="/client/cardiogramme.svg"
              alt=""
              aria-hidden="true"
              className="client-card__ecg"
            />

            <button
              type="button"
              className="client-card__download"
              onClick={handleCardAction}
              aria-label={cardActionLabel}
              title={cardActionLabel}
            >
              {cardActionLabel}
            </button>
          </article>

          <article className="client-guarantees" aria-labelledby="client-guarantees-title">
            <h2 id="client-guarantees-title" className="client-guarantees__title">
              Mes Garanties
            </h2>
            <ul className="client-guarantees__list" aria-label="Garanties incluses dans la formule">
              {guaranteeItems.map((item) => (
                <li key={item.id} className="client-guarantees__item">
                  <span className="client-guarantees__icon" aria-hidden="true">
                    ✓
                  </span>
                  <span className="client-guarantees__label">{item.label}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="client-partners">
          <h2>Partenaires</h2>
          <p className="client-partners__intro">
            Les 3 hopitaux les plus proches sont affiches sur la carte. Clique sur un hopital pour voir sa position exacte et le trajet calcule en temps reel.
          </p>
          <p className="client-partners__intro">
            {userPosition
              ? `Votre position exacte: ${userPosition[0].toFixed(5)}, ${userPosition[1].toFixed(5)}`
              : geolocationError
                ? `Position utilisateur indisponible: ${geolocationError}`
                : 'Recuperation de votre position exacte...'}
          </p>
          {isLoadingHospitals && (
            <p className="client-partners__intro">
              Recherche des hopitaux les plus proches...
            </p>
          )}
          {userPosition && (
            <p className="client-partners__intro">
              {isLoadingRoute
                ? 'Calcul du trajet en cours...'
                : `Trajet affiche entre votre position et ${selectedHospital.name}.`}
            </p>
          )}
          {userPosition && distanceToHospitalKm !== null && targetBearing !== null && (
            <p className="client-partners__intro">
              Distance restante: {distanceToHospitalKm.toFixed(2)} km - Direction cible: {bearingToCardinal(targetBearing)} ({Math.round(targetBearing)}deg)
            </p>
          )}
          {userPosition && (
            <p className="client-partners__intro">
              Precision GPS: {locationAccuracyM ? `${Math.round(locationAccuracyM)} m` : 'N/A'} - Vitesse: {speedKmh !== null ? `${speedKmh.toFixed(1)} km/h` : 'N/A'}
            </p>
          )}
          {userPosition && movementBearing !== null && targetBearing !== null && isHeadingCorrect !== null && (
            <p className="client-partners__intro">
              Votre cap: {bearingToCardinal(movementBearing)} ({Math.round(movementBearing)}deg) - {isHeadingCorrect ? 'Vous vous dirigez vers le bon hopital.' : 'Direction a corriger pour atteindre l hopital choisi.'}
            </p>
          )}

          <div className="client-partners__layout">
            <div className="client-partners__list">
              {topHospitals.map((hospital) => (
                <button
                  key={hospital.id}
                  type="button"
                  className={`client-partners__item${selectedHospitalId === hospital.id ? ' client-partners__item--active' : ''}`}
                  onClick={() => setSelectedHospitalId(hospital.id)}
                >
                  <span className="client-partners__item-title">
                    {hospital.label}
                  </span>
                  <span className="client-partners__item-name">{hospital.name}</span>
                  <span className="client-partners__item-meta">
                    {formatDistanceKm(hospital.distanceKm)} - {hospital.address}
                  </span>
                </button>
              ))}
            </div>

            <div className="client-partners__map-wrap">
              <MapContainer
                center={userPosition ?? selectedHospital.position}
                zoom={14}
                className="client-partners__map"
                scrollWheelZoom
              >
                <MapFollowUser userPosition={userPosition} isCompactMap={isCompactMap} />
                <MapFitBounds
                  userPosition={userPosition}
                  hospitalPosition={selectedHospital.position}
                  routeCoords={routeCoords}
                  isCompactMap={isCompactMap}
                />
                <ScaleControl position="bottomleft" />
                <LayersControl position="topright">
                  <LayersControl.BaseLayer checked name="OpenStreetMap Standard">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="OpenStreetMap Humanitarian">
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team'
                      url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    />
                  </LayersControl.BaseLayer>
                  <LayersControl.BaseLayer name="OpenTopoMap">
                    <TileLayer
                      attribution='Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
                      url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    />
                  </LayersControl.BaseLayer>
                </LayersControl>

                {userPosition && (
                  <Marker position={userPosition} icon={userArrowIcon}>
                    <Popup>
                      <strong>Votre position</strong>
                      <br />
                      Coordonnees: {userPosition[0].toFixed(5)}, {userPosition[1].toFixed(5)}
                    </Popup>
                  </Marker>
                )}
                {userPosition && locationAccuracyM !== null && (
                  <Circle
                    center={userPosition}
                    radius={Math.min(locationAccuracyM, 120)}
                    pathOptions={{ color: '#0a6cff', fillColor: '#0a6cff', fillOpacity: 0.08, weight: 1 }}
                  />
                )}

                {topHospitals.map((hospital) => (
                  <Marker
                    key={hospital.id}
                    position={hospital.position}
                    icon={getHospitalMarkerIcon(hospital, hospital.id === selectedHospitalId)}
                  >
                    <Popup>
                      <strong>{hospital.label}</strong>
                      <br />
                      {hospital.name}
                      <br />
                      {hospital.address}
                      {hospital.telephone ? (
                        <>
                          <br />
                          Tel: {hospital.telephone}
                        </>
                      ) : null}
                      <br />
                      Coordonnees: {hospital.position[0].toFixed(4)}, {hospital.position[1].toFixed(4)}
                    </Popup>
                  </Marker>
                ))}

                {routeCoords.length > 1 && (
                  <>
                    <Polyline positions={routeCoords} pathOptions={{ color: '#14b8a6', weight: 10, opacity: 0.15 }} />
                    <Polyline positions={routeCoords} pathOptions={{ color: '#0f766e', weight: 5 }} />
                  </>
                )}
                {movementTrail.length > 1 && (
                  <Polyline
                    positions={movementTrail}
                    pathOptions={{ color: '#0a6cff', weight: 3, opacity: 0.65, dashArray: '6 8' }}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </section>
      </main>

      <RechargeCardModal
        open={rechargeModalStep !== null}
        step={rechargeModalStep ?? 'summary'}
        title={rechargeTitle}
        priceLabel={rechargePriceLabel}
        amountText={rechargeAmountText}
        features={guaranteeItems}
        isSubmitting={isInitiatingPayment}
        errorMessage={rechargeError}
        onClose={closeRechargeModal}
        onProceedToWave={handleProceedToWave}
        onPayNow={handleRechargeNow}
      />
    </div>
  );
};

export default ClientSpacePage;
