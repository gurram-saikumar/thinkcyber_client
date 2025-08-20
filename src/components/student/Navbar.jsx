import React, { useContext, useState, useRef, useEffect } from 'react'; 
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { topicService } from '../../services/apiService';
import LoginModal from './LoginModal';

// Custom LanguageDropdown component
function LanguageDropdown({ assets }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('English');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Google Translate logic
  const handleLanguageChange = (lang) => {
    setSelected(lang);
    setOpen(false);
    let googleLang = 'en';
    if (lang === 'Hindi') googleLang = 'hi';
    if (lang === 'Telugu') googleLang = 'te';

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = function () {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,te',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        );
      };
    }
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
      setTimeout(() => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = googleLang;
          select.dispatchEvent(new Event('change'));
        }
      }, 1500);
    } else {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = googleLang;
        select.dispatchEvent(new Event('change'));
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Select Language"
      >
        <img src={assets.language_icon} alt="Language" className="w-12 h-12" />
      </button>
      {open && (
        <div
          className="absolute top-14 left-1/2 -translate-x-1/2 min-w-[220px] bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <div className="px-4 pt-4 pb-2 border-b border-gray-100">
            <p className="font-semibold text-gray-800">Select Language</p>
            <p className="text-xs text-gray-500 mb-2">Choose Preferred Language</p>
          </div>
          <ul className="py-2">
            {['English', 'Telugu', 'Hindi'].map((lang) => (
              <li
                key={lang}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0 ${selected === lang ? 'font-bold text-blue-600' : 'text-gray-700'
                  }`}
                onClick={() => handleLanguageChange(lang)}
              >
                {lang}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Google Translate container (hidden) */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </div>
  );
}
const Navbar = () => {
  const { userData } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = React.useState(false);
  const [wishlist, setWishlist] = React.useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [topics, setTopics] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [showResults, setShowResults] = React.useState(false);
  // Fetch topics from your API on mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await topicService.getAllTopics({ limit: 100 });
        setTopics(response?.data || []);
      } catch {
        setTopics([]);
      }
    };
    fetchTopics();
  }, []);
   // Sync wishlist from localStorage on storage change (for multi-tab)
  useEffect(() => {
    const handleStorage = () => {
      debugger;
      const stored = localStorage.getItem('wishlist');
      setWishlist(stored ? JSON.parse(stored) : []);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  console.log('Wishlist:', wishlist);
  if(userData && userData.isVerified) {
    setShowLogin(true);
  }

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 md:px-10 lg:px-24 border-b border-gray-300 py-4 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <a href="/">
          <img src={assets.logo} alt="Logo" className="w-36 lg:w-56 cursor-pointer" />
        </a>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-12 text-[#747579] font-semibold">
        <a href="/" className="hover:text-blue-600">Home</a>
        <a href="/about" className="hover:text-blue-600">About Us</a>
        <a href="/contact" className="hover:text-blue-600">Contact Us</a>
      </div>

      {/* Search Bar with topic search */}
      <div className="hidden md:flex items-center border border-gray-300 rounded-md bg-[#F5F7F9] px-4 py-3 relative">
        <input
          type="text"
          placeholder="Search topics..."
          className="outline-none text-sm text-gray-600 flex-grow bg-[#F5F7F9]"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            if (e.target.value.length > 0) {
              const results = topics.filter(topic =>
                (topic.name || topic.title || '').toLowerCase().includes(e.target.value.toLowerCase()) ||
                (topic.description || '').toLowerCase().includes(e.target.value.toLowerCase())
              );
              setSearchResults(results);
              setShowResults(true);
            } else {
              setSearchResults([]);
              setShowResults(false);
            }
          }}
          onFocus={() => searchTerm && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        <button onClick={() => setShowResults(true)}>
          <img src={assets.search_icon} alt="Search" className="w-5 h-5" />
        </button>
        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
            {searchResults.map(topic => (
              <div
                key={topic.id}
                className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
                onMouseDown={() => {
                  setShowResults(false);
                  setSearchTerm('');
                  navigate(`/course/${topic.id}`);
                }}
              >
                <div className="font-bold text-blue-600">{topic.name || topic.title}</div>
                <div className="text-gray-500 text-xs">{topic.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-4">
        {wishlist.length === 0 ? (
          <button>
            <img src={assets.favorite_icon} alt="Favorites" className="w-12 h-12" />
          </button>
        ) : (
          <Link to="/wishlist">
            <img src={assets.favorite_icon} alt="Favorites" className="w-12 h-12" />
          </Link>
        )}

        {/* Language Dropdown */}
        <LanguageDropdown assets={assets} />

        {/* User Dropdown */}
        {userData ? (
          <div className="relative group">
            <button className="flex items-center gap-2 focus:outline-none">
              <img src={assets.usernew_icon} alt="User" className="w-12 h-12 rounded-full" />
              <span className="font-semibold text-gray-700">{userData.name || userData.email}</span>
              <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 hidden group-hover:block group-focus:block">
              <Link
                to="/enrollments"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 text-sm"
              >
                My Enrollments
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 text-sm"
                onClick={() => {
                  localStorage.removeItem('userData');
                  navigate('/login');
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>
            <img src={assets.usernew_icon} alt="User" className="w-12 h-12" />
          </button>
        )}
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default Navbar;
