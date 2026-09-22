import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePresence } from '../hooks/usePresence';
import LivePeopleCounter from '../components/LivePeopleCounter';

export default function About() {
  const p = usePresence();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-14 w-full">
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight">About VibeMeet.</h1>
        <p className="text-muted mt-5">
          VibeMeet is an anonymous 1-on-1 chat platform. There are no profiles, no follower counts, no
          feeds to scroll. You match with whoever is online right now — for a real, short, spontaneous
          conversation. When you leave, the conversation is gone.
        </p>

        <div className="mt-8 bg-card border border-border rounded-lg p-5">
          <div className="text-xs uppercase tracking-widest text-muted-2">Right now</div>
          <div className="mt-2">
            <LivePeopleCounter count={p.onlineCount} connected={p.presenceConnected} error={p.presenceError} />
          </div>
          <div className="text-xs text-muted-2 mt-3">
            This number reflects real, currently-connected participants. We don’t inflate it. If nobody’s
            here, we show 0. If the server can’t be reached, we say so.
          </div>
        </div>

        <h2 className="font-display text-2xl mt-10">How matchmaking works</h2>
        <ol className="list-decimal ml-5 mt-3 space-y-2 text-muted">
          <li>You pick a mode (video or text) and optional filters.</li>
          <li>We add you to a live queue. Everyone in the queue is a real, currently-online participant.</li>
          <li>When a compatible participant is found, we pair you. Video goes peer-to-peer via WebRTC. Text messages travel over a real-time channel and are never stored on our server.</li>
          <li>Either of you can hit Next to disconnect and get matched again, or End to leave entirely.</li>
        </ol>

        <h2 className="font-display text-2xl mt-10">What we do not do</h2>
        <ul className="list-disc ml-5 mt-3 space-y-2 text-muted">
          <li>No fake users. No filler bots. No pre-recorded video loops.</li>
          <li>No inflated “1,000+ online” text. If the counter shows a number, that’s the number.</li>
          <li>No storing chat messages, video, or audio.</li>
          <li>No exposing IPs, socket IDs, emails, or precise location to other participants.</li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}
