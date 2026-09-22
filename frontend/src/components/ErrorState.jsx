import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ title, description, action }) {
  return (
    <div className="text-center py-8 px-6">
      <div className="w-12 h-12 mx-auto rounded-full bg-danger/10 grid place-items-center text-danger">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="font-display text-xl mt-4">{title}</div>
      {description && <div className="text-sm text-muted mt-2 max-w-md mx-auto">{description}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
