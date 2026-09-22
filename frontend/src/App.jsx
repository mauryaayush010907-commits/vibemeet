import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VideoChat from './pages/VideoChat';
import TextChat from './pages/TextChat';
import Safety from './pages/Safety';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Guidelines from './pages/Guidelines';
import NotFound from './pages/NotFound';
import { ChatProvider } from './context/ChatContext';
import { ToastProvider } from './components/Toast';
import AgeGate from './components/AgeGate';

export default function App() {
  return (
    <ChatProvider>
      <ToastProvider>
        <AgeGate />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video" element={<VideoChat />} />
            <Route path="/text" element={<TextChat />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ChatProvider>
  );
}
