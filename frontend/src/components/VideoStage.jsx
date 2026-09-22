import RemoteVideo from './RemoteVideo';
import LocalVideoPreview from './LocalVideoPreview';
import ConnectionStatus from './ConnectionStatus';

export default function VideoStage({ localStream, remoteStream, remoteHasVideo, camOn, state, peerDisconnected }) {
  const label = peerDisconnected ? 'Stranger disconnected'
    : state === 'connected' ? 'Connected'
    : state === 'connecting' ? 'Connecting…'
    : state === 'reconnecting' ? 'Reconnecting…'
    : state === 'failed' ? 'Connection failed'
    : 'Disconnected';
  return (
    <div className="relative w-full h-full">
      <RemoteVideo stream={remoteStream} remoteHasVideo={remoteHasVideo} connectionLabel={label} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-3 right-3 pointer-events-auto">
          <ConnectionStatus state={peerDisconnected ? 'disconnected' : state} />
        </div>
      </div>
      <LocalVideoPreview stream={localStream} cameraOn={camOn} />
    </div>
  );
}
