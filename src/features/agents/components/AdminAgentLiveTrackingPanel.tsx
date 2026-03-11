import type { FC } from 'react';
import { useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import ConnectionBadge from '../../../shared/components/ConnectionBadge';
import ErrorBanner from '../../../shared/components/ErrorBanner';
import PageLoader from '../../../shared/components/PageLoader';
import { useAdminLiveAgents } from '../hooks/useAdminLiveAgents';

const movingMarker = () =>
  L.divIcon({
    className: 'agent-live-map__icon-wrap',
    html: '<div style="width:16px;height:16px;border-radius:999px;background:#16a34a;border:2px solid #fff;box-shadow:0 0 0 3px rgba(22,163,74,.24);"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const stoppedMarker = () =>
  L.divIcon({
    className: 'agent-live-map__icon-wrap',
    html: '<div style="width:16px;height:16px;border-radius:999px;background:#dc2626;border:2px solid #fff;box-shadow:0 0 0 3px rgba(220,38,38,.2);"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const AdminAgentLiveTrackingPanel: FC = () => {
  const { agents, isConnected, error, isLoading } = useAdminLiveAgents();
  const [selectedAgentId, setSelectedAgentId] = useState('');

  const effectiveSelectedId = agents.some((agent) => agent.agentId === selectedAgentId)
    ? selectedAgentId
    : agents[0]?.agentId ?? '';

  const selected = useMemo(
    () => agents.find((agent) => agent.agentId === effectiveSelectedId) ?? agents[0],
    [agents, effectiveSelectedId]
  );

  const center: [number, number] = selected
    ? [selected.latitude, selected.longitude]
    : [14.6928, -17.4467];

  return (
    <section className="agent-live">
      <div className="agent-live__header">
        <h2>Suivi terrain en temps reel</h2>
        <p>
          <ConnectionBadge connected={isConnected} connectedLabel="WebSocket connecte" disconnectedLabel="WebSocket deconnecte" />
        </p>
        {error && <ErrorBanner message={error} />}
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="agent-live__layout">
          <div className="agent-live__list">
            {agents.map((agent) => (
              <button
                key={agent.agentId}
                type="button"
                className={`agent-live__item${effectiveSelectedId === agent.agentId ? ' agent-live__item--active' : ''}`}
                onClick={() => setSelectedAgentId(agent.agentId)}
              >
                <div className="agent-live__item-top">
                  <div className="agent-live__identity">
                    <div>
                      <strong>
                        {agent.prenom} {agent.nom}
                      </strong>
                      <span>{agent.matricule}</span>
                    </div>
                  </div>
                  <span className={`agent-live__badge ${agent.moving ? 'agent-live__badge--moving' : 'agent-live__badge--stopped'}`}>
                    {agent.moving ? 'En mouvement' : 'Immobile'}
                  </span>
                </div>
                <div className="agent-live__meta">
                  <span>
                    {agent.latitude.toFixed(5)}, {agent.longitude.toFixed(5)}
                  </span>
                  <span>Vitesse: {Math.round(agent.speedKmh)} km/h</span>
                </div>
              </button>
            ))}
            {agents.length === 0 && <p className="agent-empty-state">Aucune position agent recue.</p>}
          </div>

          <div className="agent-live__map-card">
            <MapContainer center={center} zoom={13} className="agent-live__map" scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {agents.map((agent) => (
                <Marker
                  key={agent.agentId}
                  position={[agent.latitude, agent.longitude]}
                  icon={agent.moving ? movingMarker() : stoppedMarker()}
                >
                  <Popup>
                    <strong>
                      {agent.prenom} {agent.nom}
                    </strong>
                    <br />
                    {agent.latitude.toFixed(5)}, {agent.longitude.toFixed(5)}
                    <br />
                    {agent.moving ? 'En mouvement' : 'Immobile'}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <div className="agent-live__selected-meta">
              <strong>{selected ? `${selected.prenom} ${selected.nom}` : 'Aucun agent selectionne'}</strong>
              <span>
                Derniere mise a jour:{' '}
                {selected ? new Date(selected.updatedAt).toLocaleTimeString() : 'N/A'}
              </span>
              <span>Statut: {selected ? (selected.moving ? 'En mouvement' : 'Immobile') : 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminAgentLiveTrackingPanel;
