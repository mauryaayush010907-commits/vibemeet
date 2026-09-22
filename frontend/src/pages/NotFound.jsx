import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { Home as HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 grid place-items-center px-6">
        <div className="text-center max-w-md">
          <div className="font-display text-7xl text-primary">404</div>
          <div className="font-display text-2xl mt-3">Page not found</div>
          <p className="text-muted mt-3">The page you're looking for doesn't exist or has moved.</p>
          <div className="mt-6">
            <Link to="/"><Button leftIcon={<HomeIcon className="w-4 h-4" />}>Back home</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
