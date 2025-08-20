import React, { useState } from 'react';
import { authService } from '../../services/apiService';
import VerifyModal from './VerifyModal';
import { assets } from '../../assets/assets';
import SignupModal from './SignupModal';
import { toast } from 'react-toastify';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'తెలుగు', native: 'Telugu' },
  { code: 'hi', label: 'हिंदी', native: 'Hindi' },
];

const LoginModal = ({ isOpen, onClose }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  if (!isOpen && !showSignup && !showVerify) return null;

  // Google Translate logic
  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    let googleLang = 'en';
    if (lang === 'hi') googleLang = 'hi';
    if (lang === 'te') googleLang = 'te';

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

  if (showSignup) {
    return <SignupModal isOpen={showSignup} onClose={() => { setShowSignup(false); onClose(); }} />;
  }
  if (showVerify) {
    return <VerifyModal isOpen={showVerify} onClose={() => { setShowVerify(false); onClose(); }} email={email} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl flex overflow-hidden relative animate-fade-in">
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Left Side Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center bg-[#E6F0F9] w-1/2 p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome to our largest community</h2>
          <p className="text-gray-600 mb-6 text-center">Let's learn something new today!</p>
          <img src={assets.Loginbanner} alt="Welcome" className="max-w-xs" />
        </div>
        {/* Right Side Login Form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-10">
          <div className="flex items-center gap-2 mb-6">
            <img src={assets.LoginLogo} alt="ThinkCyber" className="w-44" />
           </div>
          <h3 className="text-2xl font-bold mb-2">Login</h3>
          <p className="text-gray-600 mb-6">Nice to see you! Please log in with your account.</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setLoading(true);
              try {
                const res = await authService.loginUser(email, password);
                setLoading(false);
                if (res.success === true) {
                  toast.success(res.message);
                  setShowVerify(true); // Open verify modal
                } else {
                  setError('Login failed. Please check your credentials.');
                }
              } catch (err) {
                setLoading(false);
                setError('Login failed. Please try again.');
              }
            }}
          >
            <label className="block text-gray-700 mb-1 font-semibold">Email Address</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
              placeholder="Example@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            /> 
            {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white py-2 rounded font-semibold mb-4" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-semibold">Select Language</label>
            <span className="block text-xs text-gray-400 mb-2">Choose Preferred Language</span>
            <div className="flex gap-3">
              {LANGUAGES.map(lang => (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex-1 border ${selectedLang === lang.code ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} text-gray-600 px-4 py-3 rounded-lg font-semibold flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-blue-400 relative`}
                >
                  <span className="text-base font-bold text-black">{lang.label}</span>
                  <span className="text-xs font-normal">{lang.native}</span>
                  {selectedLang === lang.code && (
                    <span className="absolute top-2 right-2 text-blue-600">
                      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" stroke="#2563eb" strokeWidth="2" fill="#fff"/><path d="M6 10.5l2.5 2.5L14 8.5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          {/* Google Translate container (hidden) */}
          <div id="google_translate_element" style={{ display: 'none' }}></div>
          </div>
          <div className="text-sm text-gray-500 mt-4 text-center">
            Already Have An Account? <button type="button" onClick={() => setShowSignup(true)} className="text-blue-600 font-medium">Create <span className="underline">Account</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
