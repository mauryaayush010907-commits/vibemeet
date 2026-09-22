import { ShieldAlert } from 'lucide-react';

export default function SafetyNotice({ compact = false }) {
  if (compact) {
    return (
      <div className="text-xs text-muted flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <span>Stay anonymous. Never share personal information. Use Report or Block if anything feels wrong.</span>
      </div>
    );
  }
  return (
    <div className="bg-warning/5 border border-warning/30 rounded-[14px] p-4 flex items-start gap-3">
      <ShieldAlert className="w-5 h-5 text-warning shrink-0 mt-0.5" />
      <div className="text-sm text-text">
        <div className="font-medium">Stay safe</div>
        <p className="text-muted mt-1">
          You're talking to a real stranger. Don't share your name, phone number, address, financial
          details, or explicit content. Report or block anyone who makes you uncomfortable.
        </p>
      </div>
    </div>
  );
}
