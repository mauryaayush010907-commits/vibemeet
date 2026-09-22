import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-14 w-full">
        <div className="text-xs uppercase tracking-widest text-muted-2">Legal</div>
        <h1 className="font-display text-4xl mt-2">Terms of Service</h1>
        <p className="text-muted mt-3">By using VibeMeet, you agree to these terms.</p>

        <section className="mt-8 space-y-6 text-[15px] leading-relaxed text-text">
          <div>
            <h2 className="font-display text-xl">Eligibility</h2>
            <p className="text-muted mt-2">You must be 18 or older. You may not use VibeMeet if you are prohibited from receiving our services under applicable law.</p>
          </div>
          <div>
            <h2 className="font-display text-xl">Acceptable use</h2>
            <p className="text-muted mt-2">You agree not to: harass other users, share sexual content involving minors, transmit threats, engage in commercial spam, or attempt to record or redistribute others' video/audio without consent.</p>
          </div>
          <div>
            <h2 className="font-display text-xl">Enforcement</h2>
            <p className="text-muted mt-2">We may end your session, block you, or ban your device without notice if you violate these terms. Serious violations may be reported to authorities.</p>
          </div>
          <div>
            <h2 className="font-display text-xl">Warranty disclaimer</h2>
            <p className="text-muted mt-2">VibeMeet is provided “as is” without warranties of any kind. We do not guarantee uptime, match availability, or connection quality.</p>
          </div>
          <div>
            <h2 className="font-display text-xl">Changes</h2>
            <p className="text-muted mt-2">We may update these terms from time to time. Continued use of the service constitutes acceptance of any changes.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
