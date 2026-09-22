import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-14 w-full">
        <div className="text-xs uppercase tracking-widest text-muted-2">Legal</div>
        <h1 className="font-display text-4xl mt-2">Privacy Policy</h1>
        <p className="text-muted mt-3">Last updated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="mt-8 space-y-6 text-[15px] leading-relaxed text-text">
          <div>
            <h2 className="font-display text-xl">What we collect</h2>
            <p className="text-muted mt-2">Anonymous per-tab session identifiers, your selected matchmaking filters, and safety-related reports/blocks you submit. We do not offer accounts or collect email addresses.</p>
          </div>
          <div>
            <h2 className="font-display text-xl">What we do NOT collect</h2>
            <ul className="list-disc ml-5 mt-2 text-muted space-y-1">
              <li>Video or audio streams (they travel peer-to-peer between participants).</li>
              <li>Chat message contents (real-time only, never persisted).</li>
              <li>IP addresses or device fingerprints beyond what's needed to serve requests.</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl">Presence data</h2>
            <p className="text-muted mt-2">To power the live online counter, we track your session's last-seen timestamp, current status (idle / searching / in session), and mode (video / text). Stale sessions are cleaned up automatically.</p>
          </div>
          <div>
            <h2 className="font-display text-xl">Third parties</h2>
            <p className="text-muted mt-2">We use MongoDB for presence and safety data. Real-time messaging remains ephemeral, and we do not sell your data to advertisers.</p>
          </div>
          <div>
            <h2 className="font-display text-xl">Your rights</h2>
            <p className="text-muted mt-2">You can clear your anonymous session by clearing your browser storage. Safety reports and blocks are retained only as needed for moderation.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
