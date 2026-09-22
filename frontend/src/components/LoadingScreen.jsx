export default function LoadingScreen({ label = 'Loading…' }) {
  return (
    <div className="min-h-screen grid place-items-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <span className="inline-block w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
        <div className="text-sm text-muted">{label}</div>
      </div>
    </div>
  );
}
