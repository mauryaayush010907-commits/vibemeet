import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, X } from 'lucide-react';

export default function Guidelines() {
  const dos = [
    'Be kind. There is a real person on the other side.',
    'Respect “no”. If someone says they’re uncomfortable, disconnect.',
    'Keep it appropriate for a public space.',
    'Report anything abusive, threatening, or illegal.',
  ];
  const donts = [
    'No nudity or sexual content.',
    'No hate speech, harassment, or slurs.',
    'No sharing personal identifying information about yourself or others.',
    'No recording other participants without explicit consent.',
    'No spam, ads, promotions, or scams.',
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-14 w-full">
        <div className="text-xs uppercase tracking-widest text-muted-2">Community</div>
        <h1 className="font-display text-4xl mt-2">Community Guidelines</h1>
        <p className="text-muted mt-3">A short list of what we expect from everyone on VibeMeet.</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <div className="bg-card border border-border rounded-[18px] p-5">
            <div className="font-display text-xl text-success">Do</div>
            <ul className="mt-3 space-y-2 text-sm text-text">
              {dos.map((d) => (
                <li key={d} className="flex items-start gap-2"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" />{d}</li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-border rounded-[18px] p-5">
            <div className="font-display text-xl text-danger">Don't</div>
            <ul className="mt-3 space-y-2 text-sm text-text">
              {donts.map((d) => (
                <li key={d} className="flex items-start gap-2"><X className="w-4 h-4 text-danger shrink-0 mt-0.5" />{d}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-sm text-muted mt-8">
          Violations may result in immediate session termination, device bans, and — for serious cases —
          reports to law enforcement.
        </p>
      </main>
      <Footer />
    </div>
  );
}
