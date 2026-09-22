import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePresence } from '../hooks/usePresence';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Lock, Users, Handshake, Sparkles, Video, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import LivePeopleCounter from '../components/LivePeopleCounter';
import Button from '../components/Button';

function ValueProp({ icon, title, body }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-[18px] p-5"
    >
      <div className="w-10 h-10 rounded-[10px] bg-card-2 grid place-items-center text-primary">{icon}</div>
      <div className="font-display text-lg mt-4">{title}</div>
      <div className="text-sm text-muted mt-1">{body}</div>
    </motion.div>
  );
}

function QueueRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-card-2 border border-border px-3.5 py-2.5">
      <div className="text-sm text-text">{label}</div>
      <div className="font-mono text-lg tabular-nums text-text">
        {value === null ? <span className="text-muted-2">—</span> : value}
      </div>
    </div>
  );
}

function StatCell({ label, value, big }) {
  return (
    <div className={`rounded-[14px] bg-card-2 border border-border px-4 py-3 ${big ? 'col-span-2' : ''}`}>
      <div className="text-[11px] uppercase tracking-widest text-muted-2">{label}</div>
      <div className={`font-mono tabular-nums text-text ${big ? 'text-4xl mt-1' : 'text-2xl mt-1'}`}>
        {value === null ? <span className="text-muted-2">—</span> : value.toLocaleString()}
      </div>
    </div>
  );
}

function HeroSection({ presence }) {
  const nav = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-24 sm:pb-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-medium bg-card border border-border rounded-full px-3 py-1.5 mb-6">
              <LivePeopleCounter count={presence.onlineCount} connected={presence.presenceConnected} error={presence.presenceError} compact />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
              className="font-display text-[44px] sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
              Real people.<br /><span className="italic text-primary">Real conversations.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-6 text-lg text-muted max-w-xl">
              Meet someone new over video or anonymous text. No profiles. No feeds.
              Just a fresh conversation, matched live from whoever is online right now.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => nav('/video')} leftIcon={<Video className="w-5 h-5" />}>Start a video chat</Button>
              <Button size="lg" variant="outline" onClick={() => nav('/text')} leftIcon={<MessageSquare className="w-5 h-5" />}>Text chat instead</Button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-accent" /> Anonymous by default</span>
              <span className="inline-flex items-center gap-2"><Zap className="w-4 h-4 text-secondary" /> No signup required</span>
              <span className="inline-flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Peer-to-peer video</span>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-tr from-primary/15 via-transparent to-secondary/15 blur-2xl rounded-full pointer-events-none" />
              <div className="relative bg-card border border-border rounded-[24px] p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-2">Live right now</div>
                    <div className="font-display text-2xl mt-1">Presence</div>
                  </div>
                  <span className="live-dot" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <StatCell label="Online" value={presence.onlineCount} big />
                  <StatCell label="Searching" value={presence.searchingCount} />
                  <StatCell label="In video chat" value={presence.videoChatCount} />
                  <StatCell label="In text chat" value={presence.textChatCount} />
                </div>
                <div className="mt-6 pt-5 border-t border-border text-xs text-muted-2">
                  Every number above reflects a real, currently‑connected participant. If it drops to zero, it's zero.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const presence = usePresence();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection presence={presence} />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-4">
            <ValueProp icon={<Handshake className="w-5 h-5" />} title="Live matchmaking" body="Every match is a real person actively looking to chat right now. Not a bot, not a recording." />
            <ValueProp icon={<Lock className="w-5 h-5" />} title="Anonymous by default" body="No name, no phone number, no profile picture. Just say hi and see where it goes." />
            <ValueProp icon={<Eye className="w-5 h-5" />} title="Nothing stored" body="Messages are ephemeral. Video is peer-to-peer. We only keep aggregate counts and safety reports." />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-2">How it works</div>
              <h2 className="font-display text-3xl sm:text-4xl mt-2">Three steps.<br />That's the whole app.</h2>
              <ol className="mt-6 space-y-4">
                {[
                  { n: '01', t: 'Pick your mode', d: 'Video (camera + mic) or anonymous text.' },
                  { n: '02', t: 'Set optional filters', d: 'Match with a specific gender, country, language, or shared interests.' },
                  { n: '03', t: 'Get matched — live', d: 'We pair you with someone who is also waiting right now. If nobody’s available, we tell you honestly.' },
                ].map((s) => (
                  <li key={s.n} className="flex items-start gap-4">
                    <div className="font-mono text-sm text-primary w-8 shrink-0">{s.n}</div>
                    <div>
                      <div className="font-medium">{s.t}</div>
                      <div className="text-sm text-muted mt-0.5">{s.d}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <Link to="/video" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                  <Sparkles className="w-4 h-4" /> Start now
                </Link>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-[22px] p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Users className="w-4 h-4" /> Live matchmaking queue
                </div>
                <LivePeopleCounter count={presence.onlineCount} connected={presence.presenceConnected} error={presence.presenceError} compact label="online" />
              </div>
              <div className="space-y-3">
                <QueueRow label="Waiting for video" value={presence.searchingVideo} />
                <QueueRow label="Waiting for text" value={presence.searchingText} />
                <QueueRow label="Currently in a video chat" value={presence.videoChatCount} />
                <QueueRow label="Currently in a text chat" value={presence.textChatCount} />
              </div>
              <div className="mt-5 pt-4 border-t border-border text-xs text-muted-2">
                Numbers are real-time and reset from live connections. If nobody’s here, we show 0.
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
