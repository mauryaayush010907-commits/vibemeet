import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, EyeOff, Ban, Flag, Users, Lock } from 'lucide-react';

export default function Safety() {
  const items = [
    { icon: EyeOff, title: 'Stay anonymous', body: 'Never share your full name, phone number, home address, workplace, school, or financial details.' },
    { icon: Users, title: 'Assume you are on camera', body: 'Anything you do or say could be recorded on the other side. Behave accordingly — and don’t record others.' },
    { icon: Flag, title: 'Report bad behavior', body: 'Every session has a Report button. We review flags and remove abusive users.' },
    { icon: Ban, title: 'Block instantly', body: 'Blocking ends the current session and prevents us from re-matching you with that person on this device.' },
    { icon: Lock, title: 'Video is peer-to-peer', body: 'Your camera stream goes directly to the other person. We don’t proxy or store video/audio.' },
    { icon: ShieldCheck, title: 'Zero tolerance', body: 'Sexual content involving minors, threats, or non-consensual sharing is banned. Violations result in bans and, where appropriate, reports to authorities.' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="inline-flex items-center gap-2 text-xs font-medium bg-card border border-border rounded-full px-3 py-1.5 mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-success" /> Community safety
        </div>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight">Your safety comes first.</h1>
        <p className="text-muted mt-4 max-w-2xl">
          VibeMeet connects real people. That means treating each other with respect — and knowing how
          to protect yourself. Here’s what to keep in mind before you tap Start.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {items.map((it) => (
            <div key={it.title} className="bg-card border border-border rounded-[18px] p-5">
              <div className="w-10 h-10 rounded-[10px] bg-card-2 grid place-items-center text-primary">
                <it.icon className="w-5 h-5" />
              </div>
              <div className="font-display text-lg mt-4">{it.title}</div>
              <div className="text-sm text-muted mt-1">{it.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-warning/5 border border-warning/30 rounded-[18px] p-6">
          <div className="font-display text-xl">Under 18?</div>
          <p className="text-sm text-muted mt-2">VibeMeet is intended for adults only. If you are under 18, please do not use this service.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
