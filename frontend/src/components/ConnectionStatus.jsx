const LABELS = {
  connecting: 'Connecting…',
  connected: 'Connected',
  reconnecting: 'Reconnecting…',
  disconnected: 'Disconnected',
  failed: 'Connection failed',
};
const DOT = {
  connecting: 'bg-warning',
  connected: 'bg-success',
  reconnecting: 'bg-warning',
  disconnected: 'bg-muted-2',
  failed: 'bg-danger',
};

export default function ConnectionStatus({ state }) {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 h-7 rounded-full bg-card-2 border border-border text-xs text-text">
      <span className={`w-1.5 h-1.5 rounded-full ${DOT[state]} ${state === 'connecting' || state === 'reconnecting' ? 'animate-pulse' : ''}`} />
      {LABELS[state]}
    </div>
  );
}
