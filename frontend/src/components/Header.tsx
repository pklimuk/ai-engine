import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import avatarImage from '../assets/avatar.png';

const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
      <nav className="max-w-screen-2xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          EDISON
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-gray-600 ${
              location.pathname === '/' ? 'text-black' : 'text-gray-500'
            }`}
          >
            Home
          </Link>
          <Link
            to="/cart"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gray-600 ${
              location.pathname === '/cart' ? 'text-black' : 'text-gray-500'
            }`}
          >
            <ShoppingCart size={18} />
            Configure
          </Link>
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-200">
            <img
              src={avatarImage}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
