import { useEffect, useRef, useState } from 'react';
import { agentApi } from '../services/agentApi';

type PositionTuple = [number, number];

type GpsStatus = 'idle' | 'ok' | 'unsupported' | 'denied' | 'error';

const AGENT_STORAGE_KEY = 'ma-sante-agent-id';
const DEFAULT_AGENT_ID = '1';

const toRadians = (value: number) => (value * Math.PI) / 180;

const distanceMeters = (from: PositionTuple, to: PositionTuple) => {
  const earthRadiusM = 6371000;
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return earthRadiusM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export function usePublishAgentLocation(enabled: boolean) {
  const latestRef = useRef<{ coords: PositionTuple; speedKmh: number; timestamp: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>(() =>
    enabled && !navigator.geolocation ? 'unsupported' : 'idle'
  );
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!navigator.geolocation) {
      return;
    }

    const persistedAuth = localStorage.getItem('ma-sante-auth');
    let userIdFromSession: string | undefined;
    if (persistedAuth) {
      try {
        userIdFromSession = JSON.parse(persistedAuth)?.state?.userId as string | undefined;
      } catch {
        userIdFromSession = undefined;
      }
    }

    const agentId = userIdFromSession ?? localStorage.getItem(AGENT_STORAGE_KEY) ?? DEFAULT_AGENT_ID;
    localStorage.setItem(AGENT_STORAGE_KEY, agentId);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords: PositionTuple = [position.coords.latitude, position.coords.longitude];
        const now = Date.now();

        const nativeSpeedKmh =
          typeof position.coords.speed === 'number' && position.coords.speed >= 0
            ? position.coords.speed * 3.6
            : null;

        const previous = latestRef.current;
        let speedKmh = nativeSpeedKmh ?? 0;

        if (nativeSpeedKmh === null && previous) {
          const meters = distanceMeters(previous.coords, coords);
          const seconds = Math.max((now - previous.timestamp) / 1000, 1);
          speedKmh = (meters / 1000) / (seconds / 3600);
        }

        latestRef.current = { coords, speedKmh, timestamp: now };
        setGpsStatus('ok');
        setGpsMessage(null);
      },
      (error) => {
        if (error.code === 1) {
          setGpsStatus('denied');
          setGpsMessage('Permission GPS refusee. Active la localisation pour publier ta position.');
          return;
        }
        setGpsStatus('error');
        setGpsMessage(error.message || 'Erreur GPS');
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    const interval = window.setInterval(() => {
      const latest = latestRef.current;
      if (!latest) return;

      void agentApi.updateLocation(agentId, {
        latitude: latest.coords[0],
        longitude: latest.coords[1],
        speedKmh: Math.max(latest.speedKmh, 0),
      });
    }, 5000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.clearInterval(interval);
    };
  }, [enabled]);

  return { gpsStatus, gpsMessage };
}
