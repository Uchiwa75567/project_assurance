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
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { authApi } from '../../features/auth/services/authApi';
import { clientApi } from '../../features/clients/services/clientApi';
import type { Client } from '../../features/clients/types/client.types';
import { packApi } from '../../features/packs/services/packApi';
import { packGarantieApi } from '../../features/garanties/services/packGarantieApi';
import type { PackGarantie } from '../../features/garanties/types/packGarantie.types';
import { souscriptionApi } from '../../features/souscriptions/services/souscriptionApi';
import type { Souscription } from '../../features/souscriptions/types/souscription.types';
import { carteApi } from '../../features/cartes/services/carteApi';
import type { Carte } from '../../features/cartes/types/carte.types';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../shared/constants/routes';
import { ASSETS } from '../../shared/constants/assets';

type Hospital = {
  id: string;
  label: string;
  name: string;
  position: [number, number];
  address: string;
  distanceKm: number;
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

const nearbyHospitals: Hospital[] = [
  {
    id: 'h1',
    label: 'Hopital 1',
    name: 'Hopital Principal de Dakar',
    position: [14.6708, -17.4352],
    address: 'Avenue Nelson Mandela, Dakar',
    distanceKm: 1.8,
  },
  {
    id: 'h2',
    label: 'Hopital 2',
    name: 'Centre Hospitalier National de Fann',
    position: [14.6924, -17.4552],
    address: 'Fann Residence, Dakar',
    distanceKm: 2.9,
  },
  {
    id: 'h3',
    label: 'Hopital 3',
    name: 'Hopital Aristide Le Dantec',
    position: [14.6732, -17.4385],
    address: 'Avenue Pasteur, Dakar',
    distanceKm: 3.4,
  },
];

const defaultHospitalMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const getHospitalMarkerIcon = (isSelected: boolean) => {
  if (!isSelected) return defaultHospitalMarkerIcon;

  return L.divIcon({
    className: 'hospital-selected-icon',
    html: `
      <div style="
        position: relative;
        width: 24px;
        height: 24px;
        border-radius: 999px;
        background: #ef4444;
        border: 2px solid #ffffff;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
      ">
        <div style="position:absolute;left:50%;top:50%;width:10px;height:2px;background:#fff;transform:translate(-50%,-50%);"></div>
        <div style="position:absolute;left:50%;top:50%;width:2px;height:10px;background:#fff;transform:translate(-50%,-50%);"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const getUserArrowIcon = (angleDeg: number, isHeadingCorrect: boolean | null) => {
  const arrowColor = isHeadingCorrect === null ? '#0a6cff' : isHeadingCorrect ? '#16a34a' : '#dc2626';

  return L.divIcon({
    className: 'user-direction-icon',
    html: `
      <div style="position: relative; width: 30px; height: 30px;">
        <style>
          @keyframes msUserPulse {
            0% { transform: scale(0.9); opacity: 0.8; }
            70% { transform: scale(1.5); opacity: 0; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        </style>
        <div style="
          position: absolute;
          left: 5px;
          top: 5px;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: rgba(10, 108, 255, 0.25);
          animation: msUserPulse 1.6s infinite;
        "></div>
        <div style="
          position: absolute;
          left: 7px;
          top: 7px;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: #0a6cff;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 2px rgba(10, 108, 255, 0.25);
        "></div>
        <div style="
          position: absolute;
          left: 15px;
          top: 15px;
          width: 0;
          height: 0;
          transform: rotate(${Math.round(angleDeg)}deg);
          transform-origin: 0 0;
        ">
          <div style="
            position: absolute;
            left: -1px;
            top: -14px;
            width: 2px;
            height: 14px;
            background: ${arrowColor};
          "></div>
          <div style="
            position: absolute;
            left: -5px;
            top: -22px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 10px solid ${arrowColor};
            filter: drop-shadow(0 0 3px rgba(0,0,0,0.25));
          "></div>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const MapFitBounds: FC<{
  userPosition: [number, number] | null;
  hospitalPosition: [number, number];
  routeCoords: [number, number][];
}> = ({ userPosition, hospitalPosition, routeCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (userPosition) return;

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
  }, [map, userPosition, hospitalPosition, routeCoords]);

  return null;
};

const MapFollowUser: FC<{ userPosition: [number, number] | null }> = ({ userPosition }) => {
  const map = useMap();
  const didInitRef = useRef(false);

  useEffect(() => {
    if (!userPosition) return;

    if (!didInitRef.current) {
      map.setView(userPosition, 16, { animate: true });
      didInitRef.current = true;
      return;
    }

    map.flyTo(userPosition, map.getZoom(), { duration: 0.7 });
  }, [map, userPosition]);

  return null;
};

const ClientSpacePage: FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [selectedHospitalId, setSelectedHospitalId] = useState(nearbyHospitals[0].id);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [distanceToHospitalKm, setDistanceToHospitalKm] = useState<number | null>(null);
  const [locationAccuracyM, setLocationAccuracyM] = useState<number | null>(null);
  const [speedKmh, setSpeedKmh] = useState<number | null>(null);
  const [targetBearing, setTargetBearing] = useState<number | null>(null);
  const [movementBearing, setMovementBearing] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isHeadingCorrect, setIsHeadingCorrect] = useState<boolean | null>(null);
  const [movementTrail, setMovementTrail] = useState<[number, number][]>([]);
  const previousUserPositionRef = useRef<[number, number] | null>(null);

  const selectedHospital = useMemo(
    () => nearbyHospitals.find((hospital) => hospital.id === selectedHospitalId) ?? nearbyHospitals[0],
    [selectedHospitalId]
  );
  const userArrowAngle = deviceHeading ?? movementBearing ?? targetBearing ?? 0;
  const userArrowIcon = useMemo(
    () => getUserArrowIcon(userArrowAngle, isHeadingCorrect),
    [userArrowAngle, isHeadingCorrect]
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocationError('La geolocalisation nest pas supportee par votre navigateur.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
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
  const [packLabel, setPackLabel] = useState<string | null>(null);
  const [carte, setCarte] = useState<Carte | null>(null);
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
        return;
      }

      let packId: string | null = null;
      let packName: string | null = null;
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

      if (!packId && clientProfile.typeAssurance) {
        try {
          const packs = await packApi.list();
          const target = clientProfile.typeAssurance.trim().toLowerCase();
          const packMatch = packs.find(
            (pack) =>
              pack.nom.trim().toLowerCase() === target ||
              pack.code.trim().toLowerCase() === target
          );
          packId = packMatch?.id ?? null;
          packName = packMatch?.nom ?? null;
        } catch {
          packId = null;
        }
      }

      if (!packId) {
        if (isMounted) setGaranties([]);
        if (isMounted) setPackLabel(packName);
        return;
      }

      try {
        if (!packName) {
          const packs = await packApi.list();
          packName = packs.find((pack) => pack.id === packId)?.nom ?? null;
        }
        if (isMounted) setPackLabel(packName);
        const data = await packGarantieApi.listByPack(packId);
        if (isMounted) setGaranties(data);
      } catch {
        if (isMounted) setGaranties([]);
        if (isMounted) setPackLabel(packName);
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
  const cardStatus = carte?.statut === 'EXPIRED' ? 'Expiree' : 'Active';
  const cardValidity = formatDate(carte?.dateExpiration);
  const cardPackLabel = packLabel ?? clientProfile?.typeAssurance ?? 'N/A';
  const qrPayload = clientProfile?.numeroAssurance ?? carte?.numeroCarte ?? displayName;

  return (
    <div className="client-space">
      <header className="client-space__header">
        <img
          src={ASSETS.adminLogo}
          alt="MA Sante Assurance"
          className="client-space__logo"
        />
        <h1 className="client-space__title">Espace Client</h1>

        <button
          type="button"
          className="client-space__user"
          onClick={handleLogout}
          title="Se deconnecter"
        >
          <span>{displayName}</span>
          {clientProfile?.photoUrl ? (
            <img src={clientProfile.photoUrl} alt={displayName} className="client-space__avatar" />
          ) : (
            <span className="client-space__avatar" aria-hidden="true" />
          )}
        </button>
      </header>

      <main className="client-space__content">
        <section className="client-space__grid">
          <article className="client-card">
            <div className="client-card__top">
              <h2>Carte Digitale Assurance</h2>
              <span className="client-card__status">{cardStatus}</span>
            </div>

            <div className="client-card__body">
              <p>Nom : {displayName}</p>
              <p>Numero Assurance : {clientProfile?.numeroAssurance ?? 'N/A'}</p>
              <p>Numero Carte : {carte?.numeroCarte ?? 'N/A'}</p>
              <p>Formule : {cardPackLabel}</p>
              <p>Validite : {cardValidity}</p>
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

            <button type="button" className="client-card__download">
              Telecharger
              <span aria-hidden="true">↓</span>
            </button>
          </article>

          <article className="client-guarantees">
            <h2>Mes Garanties</h2>
            <ul>
              {garanties.length > 0
                ? garanties.map((g) => <li key={g.id}>{g.garantieLibelle}</li>)
                : (
                  <>
                    <li>Consultations generales</li>
                    <li>Medicaments de base</li>
                    <li>Prevention (controle sante)</li>
                  </>
                )}
            </ul>
          </article>
        </section>

        <section className="client-partners">
          <h2>Partenaires</h2>
          <p className="client-partners__intro">
            Les 3 hopitaux les plus proches sont affiches sur la carte. Clique sur un hopital pour voir sa position exacte.
          </p>
          <p className="client-partners__intro">
            {userPosition
              ? `Votre position exacte: ${userPosition[0].toFixed(5)}, ${userPosition[1].toFixed(5)}`
              : geolocationError
                ? `Position utilisateur indisponible: ${geolocationError}`
                : 'Recuperation de votre position exacte...'}
          </p>
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
              {nearbyHospitals.map((hospital) => (
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
                    {hospital.distanceKm.toFixed(1)} km - {hospital.address}
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
                <MapFollowUser userPosition={userPosition} />
                <MapFitBounds
                  userPosition={userPosition}
                  hospitalPosition={selectedHospital.position}
                  routeCoords={routeCoords}
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
                      <br />
                      Cap: {bearingToCardinal(userArrowAngle)} ({Math.round(userArrowAngle)}deg)
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

                {nearbyHospitals.map((hospital) => (
                  <Marker
                    key={hospital.id}
                    position={hospital.position}
                    icon={getHospitalMarkerIcon(hospital.id === selectedHospitalId)}
                  >
                    <Popup>
                      <strong>{hospital.label}</strong>
                      <br />
                      {hospital.name}
                      <br />
                      {hospital.address}
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
    </div>
  );
};

export default ClientSpacePage;
