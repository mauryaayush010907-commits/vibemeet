import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ModeSelector from '../components/ModeSelector';
import FilterPanel from '../components/FilterPanel';
import { useChat } from '../context/ChatContext';
import { usePresence } from '../hooks/usePresence';
import { useMatchmaking } from '../hooks/useMatchmaking';
import Button from '../components/Button';
import { ArrowRight, Filter as FilterIcon, MessageSquare, ShieldCheck, Video, X } from 'lucide-react';
import MatchLoader from '../components/MatchLoader';
import ChatBox from '../components/ChatBox';
import SafetyNotice from '../components/SafetyNotice';
import ReportModal from '../components/ReportModal';
import BlockModal from '../components/BlockModel';
import NextButton from '../components/NextButton';
import { useToast } from '../components/Toast';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../services/api';

export default function TextChat() {
  const mode = 'text';
  const { filters, setFilters, sessionId } = useChat();
  const nav = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const toast = useToast();

  const session = useMatchmaking();
  const presence = usePresence({
    status: session.phase === 'searching' ? 'searching'
      : (session.phase === 'connecting' || session.phase === 'connected') ? 'in_session'
      : 'idle',
    mode: session.phase !== 'idle' ? mode : null,
  });

  const availableForMode = presence.searchingText;

  useEffect(() => {
    if (session.phase === 'connected' && !session.peerDisconnected) {
      toast.push({ kind: 'success', title: 'Match found', description: 'You are now chatting.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.phase]);

  useEffect(() => {
    if (session.peerDisconnected) toast.push({ kind: 'info', title: 'Stranger disconnected', description: 'Tap Next to find someone else.' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.peerDisconnected]);

  const submitReport = async (reason, description) => {
    if (!session.peer) return;
    try {
      await api('/api/report', {
        reporter_session: sessionId, reported_session: session.peer.peer_session_id,
        match_id: session.peer.match_id, reason, description,
      });
      toast.push({ kind: 'success', title: 'Report submitted' });
    } catch (e) { toast.push({ kind: 'error', title: 'Could not submit report', description: e?.message }); }
  };

  const submitBlock = async () => {
    if (!session.peer) return;
    try {
      await api('/api/block', { blocker_session: sessionId, blocked_session: session.peer.peer_session_id, match_id: session.peer.match_id });
      toast.push({ kind: 'success', title: 'User blocked', description: 'Session ended.' });
      await session.endSession({ notifyPeer: true });
    } catch (e) { toast.push({ kind: 'error', title: 'Could not block', description: e?.message }); }
  };

  const activeSession = session.phase === 'connected' || session.phase === 'connecting';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {session.phase === 'idle' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-2 mb-2">Start a text chat</div>
                  <h1 className="font-display text-3xl sm:text-4xl">Who would you like to meet?</h1>
                  <p className="text-muted mt-2">Anonymous, ephemeral text chat with a real person online right now.</p>
                </div>

                <ModeSelector
                  value={mode}
                  onChange={(m) => { if (m === 'video') nav('/video'); }}
                  videoAvailable={presence.searchingVideo}
                  textAvailable={presence.searchingText}
                  presenceConnected={presence.presenceConnected}
                />

                <div className="bg-card border border-border rounded-[18px] p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2"><FilterIcon className="w-4 h-4 text-muted" /><div className="font-medium">Filters</div></div>
                    <button onClick={() => setShowFilters((v) => !v)} className="text-sm text-muted hover:text-text lg:hidden">{showFilters ? 'Hide' : 'Show'}</button>
                  </div>
                  <div className="text-xs text-muted mb-4">Broader filters = more matches. Everything is optional.</div>
                  <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                    <FilterPanel value={filters} onChange={setFilters} />
                  </div>
                </div>

                <SafetyNotice />
              </div>

              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-24">
                  <div className="bg-card-2 border border-border rounded-[22px] p-6">
                    <div className="text-xs uppercase tracking-widest text-muted-2">People available now</div>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className={`live-dot ${presence.presenceConnected ? '' : 'warn'}`} />
                      <span className="font-mono text-4xl tabular-nums">{availableForMode === null ? '—' : availableForMode}</span>
                      <span className="text-muted text-sm">in the text queue</span>
                    </div>
                    <div className="text-xs text-muted-2 mt-2">
                      {availableForMode === 0 && 'No compatible people are available right now. You can still start — we\'ll match you the moment someone joins.'}
                      {availableForMode !== null && availableForMode > 0 && 'These are real people currently waiting for a match.'}
                    </div>
                    <div className="mt-6">
                      <Button size="lg" fullWidth onClick={() => session.findMatch('text')} leftIcon={<MessageSquare className="w-5 h-5" />} rightIcon={<ArrowRight className="w-5 h-5" />}>
                        Start text chat
                      </Button>
                      <div className="mt-3 text-[11px] text-center text-muted-2 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" /> Anonymous · Ephemeral · Not stored
                      </div>
                      <div className="mt-3 text-center">
                        <button onClick={() => nav('/video')} className="text-xs text-muted hover:text-text inline-flex items-center gap-1">
                          <Video className="w-3 h-3" /> Prefer face-to-face? Try video chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {session.phase === 'searching' && (
          <MatchLoader mode="text" availableCount={availableForMode} onCancel={session.cancelSearch} />
        )}

        {activeSession && (
          <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2 text-sm">
                <span className={`w-1.5 h-1.5 rounded-full ${session.peerDisconnected ? 'bg-muted-2' : session.connState === 'connected' ? 'bg-success' : 'bg-warning animate-pulse'}`} />
                <span className="text-text">
                  {session.peerDisconnected ? 'Stranger disconnected'
                    : session.connState === 'connected' ? 'Connected to a stranger'
                    : 'Connecting…'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setReportOpen(true)} className="h-9 px-3 text-sm text-text bg-card-2 border border-border rounded-[10px] hover:border-border-strong">Report</button>
                <button onClick={() => setBlockOpen(true)} className="h-9 px-3 text-sm text-danger bg-card-2 border border-border rounded-[10px] hover:border-danger/50">Block</button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-[18px] overflow-hidden flex flex-col h-[70vh] min-h-[420px]">
              <div className="flex-1 min-h-0">
                <ChatBox
                  messages={session.messages} onSend={session.sendChat}
                  onTyping={session.setTyping} strangerTyping={session.strangerTyping}
                  disabled={session.peerDisconnected}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="text-xs text-muted-2 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> No history is stored.</div>
              <div className="flex items-center gap-2">
                <NextButton onNext={session.next} />
                <Button variant="outline" onClick={() => session.endSession()} leftIcon={<X className="w-4 h-4" />}>End</Button>
              </div>
            </div>

            <AnimatePresence>
              {session.peerDisconnected && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-border-strong rounded-[14px] px-4 py-3 shadow-2xl text-sm"
                >
                  Stranger disconnected · <button onClick={session.next} className="text-primary font-medium ml-1">Find someone new</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} onSubmit={submitReport} />
      <BlockModal open={blockOpen} onClose={() => setBlockOpen(false)} onConfirm={submitBlock} />
    </div>
  );
}
