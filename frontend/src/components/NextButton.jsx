import { SkipForward } from 'lucide-react';
import { useRef } from 'react';
import Button from './Button';

export default function NextButton({ onNext, loading, label = 'Next', variant = 'primary' }) {
  const busy = useRef(false);
  const click = () => {
    if (busy.current || loading) return;
    busy.current = true;
    try { onNext(); } finally { setTimeout(() => (busy.current = false), 700); }
  };
  return (
    <Button variant={variant} onClick={click} loading={loading} leftIcon={<SkipForward className="w-4 h-4" />}>
      {loading ? 'Finding next person…' : label}
    </Button>
  );
}
