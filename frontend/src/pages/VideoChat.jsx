import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ModeSelector from '../components/ModeSelector';
import FilterPanel from '../components/FilterPanel';
import { useChat } from '../context/ChatContext';
import { usePresence } from '../hooks/usePresence';
import { useMatchmaking } from '../hooks/useMatchmaking';
import Button from '../components/Button';
import { ArrowRight, Camera, Filter as FilterIcon, MessageSquare, ShieldCheck, Video } from 'lucide-react';
import MatchLoader from '../components/MatchLoader';
import VideoStage from '../components/VideoStage';
import VideoControls from '../components/VideoControls';
import ChatBox from '../components/ChatBox';
import SafetyNotice from '../components/SafetyNotice';
import ReportModal from '../components/ReportModal';
import BlockModal from '../components/BlockModel';
import ErrorState from '../components/ErrorState';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function VideoChat() {
  const mode = 'video';
  const { filters, setFilters, sessionId } = useChat();
  const nav = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const toast = useToast();

  const session = useMatchmaking();
  const presence = usePresence({
    status: session.phase === 'searching' ? 'searching'
      : (session.phase === 'connecting' || session.phase === 'connected') ? 'in_session'
      : 'idle',
    mode: session.phase !== 'idle' ? mode : null,
  });

  const availableForMode = presence.searchingVideo;

  useEffect(() => {
    if (session.phase === 'connected' && !session.peerDisconnected) {
      toast.push({ kind: 'success', title: 'Match found', description: 'Connecting your video…' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.phase]);

  useEffect(() => {
    if (session.peerDisconnected) toast.push({ kind: 'info', title: 'Stranger disconnected', description: 'Tap Next to find someone else.' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.peerDisconnected]);

  useEffect(() => {
    if (session.error) toast.push({ kind: 'error', title: 'Something went wrong', description: session.error });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.error]);

  const submitReport = async (reason, description) => {
    if (!session.peer) return;
    try {
      await api('/api/report', {
        reporter_session: sessionId, reported_session: session.peer.peer_session_id,
        match_id: session.peer.match_id, reason, description,
      });
      toast.push({ kind: 'success', title: 'Report submitted', description: 'Our safety team will review it.' });
    } catch (e) { toast.push({ kind: 'error', title: 'Could not submit report', description: e?.message || 'Try again' }); }
  };

  const submitBlock = async () => {
    if (!session.peer) return;
    try {
      await api('/api/block', { blocker_session: sessionId, blocked_session: session.peer.peer_session_id, match_id: session.peer.match_id });
      toast.push({ kind: 'success', title: 'User blocked', description: 'Session ended.' });
      await session.endSession({ notifyPeer: true });
    } catch (e) { toast.push({ kind: 'error', title: 'Could not block', description: e?.message || 'Try again' }); }
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
                  <div className="text-xs uppercase tracking-widest text-muted-2 mb-2">Start a video chat</div>
                  <h1 className="font-display text-3xl sm:text-4xl">Who would you like to meet?</h1>
                  <p className="text-muted mt-2">Set optional filters. We'll match you with a real person who is online right now.</p>
                </div>

                <ModeSelector
                  value={mode}
                  onChange={(m) => { if (m === 'text') nav('/text'); }}
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
                      <span className="text-muted text-sm">in the video queue</span>
                    </div>
                    <div className="text-xs text-muted-2 mt-2">
                      {availableForMode === 0 && 'No compatible people are available right now. You can still start — we\'ll match you the moment someone joins.'}
                      {availableForMode !== null && availableForMode > 0 && 'These are real people currently waiting for a match.'}
                    </div>
                    <div className="mt-5 flex items-start gap-3 rounded-[12px] bg-bg border border-border p-3">
                      <Camera className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                      <div className="text-xs text-muted">Starting will request camera and microphone permissions.</div>
                    </div>
                    <div className="mt-6">
                      <Button size="lg" fullWidth onClick={() => session.findMatch('video')} leftIcon={<Video className="w-5 h-5" />} rightIcon={<ArrowRight className="w-5 h-5" />}>
                        Start video chat
                      </Button>
                      <div className="mt-3 text-[11px] text-center text-muted-2 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" /> Anonymous · Ephemeral · Peer-to-peer
                      </div>
                      <div className="mt-3 text-center">
                        <button onClick={() => nav('/text')} className="text-xs text-muted hover:text-text inline-flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Prefer text? Try anonymous text chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {session.phase === 'preflight' && (
          <div className="min-h-[60vh] grid place-items-center px-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 grid place-items-center">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <div className="font-display text-2xl mt-4">Requesting camera & microphone…</div>
              <div className="text-sm text-muted mt-2">Please allow access in your browser.</div>
            </div>
          </div>
        )}

        {session.phase === 'idle' && session.error && (
          <div className="max-w-lg mx-auto px-4 pb-16">
            <ErrorState
              title="Camera or microphone unavailable"
              description={session.error + ' — check your browser permissions and try again.'}
              action={<Button variant="outline" onClick={() => session.findMatch('video')}>Try again</Button>}
            />
          </div>
        )}

        {session.phase === 'searching' && (
          <MatchLoader mode="video" availableCount={availableForMode} onCancel={session.cancelSearch} />
        )}

        {activeSession && (
          <div className={`${fullscreen ? 'fixed inset-0 z-40 bg-bg' : 'max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6'}`}>
            <div className={`grid ${fullscreen ? 'grid-rows-[1fr_auto]' : 'lg:grid-cols-[1fr_360px]'} gap-4 ${fullscreen ? 'h-full p-3 sm:p-4' : ''}`}>
              <div className={`relative ${fullscreen ? '' : 'aspect-video lg:aspect-auto lg:min-h-[560px]'} rounded-[18px] overflow-hidden bg-black`}>
                <VideoStage
                  localStream={session.localStream}
                  remoteStream={session.remoteStream}
                  remoteHasVideo={session.remoteHasVideo}
                  camOn={session.camOn}
                  state={session.connState}
                  peerDisconnected={session.peerDisconnected}
                />
                <div className="absolute inset-x-0 bottom-3 flex justify-center px-3 z-20">
                  <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 shadow-2xl">
                    <VideoControls
                      micOn={session.micOn} camOn={session.camOn}
                      onToggleMic={session.toggleMic} onToggleCam={session.toggleCam}
                      onNext={session.next} onEnd={() => session.endSession()}
                      onReport={() => setReportOpen(true)}
                      isFullscreen={fullscreen}
                      onToggleFullscreen={() => setFullscreen((v) => !v)}
                    />
                  </div>
                </div>
              </div>

              {!fullscreen && (
                <div className="bg-card border border-border rounded-[18px] overflow-hidden flex flex-col min-h-[400px] lg:min-h-[560px]">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div className="font-medium">Chat</div>
                    <button onClick={() => setBlockOpen(true)} className="text-xs text-danger hover:underline">Block user</button>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ChatBox
                      messages={session.messages} onSend={session.sendChat}
                      onTyping={session.setTyping} strangerTyping={session.strangerTyping}
                      disabled={session.peerDisconnected}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} onSubmit={submitReport} />
      <BlockModal open={blockOpen} onClose={() => setBlockOpen(false)} onConfirm={submitBlock} />
    </div>
  );
}
