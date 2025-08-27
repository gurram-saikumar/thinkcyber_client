import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { homepageService } from '../../services/apiService';
import Loading from '../../components/student/Loading';

const Footer = () => {


const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const resp = await homepageService.getHomepageByLanguage('en');
        setContact(resp.data.contact);
      } catch (err) {
        setError('Failed to load contact info');
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!contact) return null;

  return (
    <div style={{ marginTop: '0px' }}>
      <footer className="bg-gray-900 px-4 md:px-36 w-full">
        <div className="flex flex-col items-center md:flex-row md:items-start justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
          <div className="flex flex-col items-center md:items-start w-full mb-8 md:mb-0">
            <img src={assets.logo_dark} alt="logo" className="w-32 mx-auto md:mx-0" />
            <p className="mt-6 text-center md:text-left text-sm text-white/80">
              ThinkCyber Education, built specifically for educational centers, is dedicated to engaging teaching and learners.
            </p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              <img src={assets.instagram_icon} alt="Instagram" className="w-10 h-10 bg-white p-0 rounded-full" />
              <img src={assets.twitter_icon} alt="Twitter" className="w-10 h-10 bg-white p-0 rounded-full" />
              <img src={assets.facebook_icon} alt="Facebook" className="w-10 h-10 bg-white p-0 rounded-full" />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start w-full mb-8 md:mb-0">
            <h2 className="font-semibold text-white mb-2 md:mb-5 text-center md:text-left">Company</h2>
            <ul className="flex flex-row md:flex-col w-full justify-center md:justify-start text-sm text-white/80 md:space-y-2 gap-6 md:gap-0">
              <li><a href="/about">About us</a></li>
              <li><a href="/contact">Contact us</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start w-full mb-8 md:mb-0">
            <h2 className="font-semibold text-white mb-2 md:mb-5 text-center md:text-left">Community</h2>
            <ul className="flex flex-row md:flex-col w-full justify-center md:justify-start text-sm text-white/80 md:space-y-2 gap-6 md:gap-0">
              <li><a href="#">Documentation</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start w-full">
            <h2 className="font-semibold text-white mb-2 md:mb-5 text-center md:text-left">Contact</h2>
            <p className="text-sm text-white/80 text-center md:text-left">{contact.phone}</p>
            <p className="text-sm text-white/80 text-center md:text-left">Email: {contact.email}</p>
            <p className="text-sm text-white/80 text-center md:text-left">Address: {contact.address}</p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              <img src={assets.google_play_icon} alt="Google Play" />
              <img src={assets.app_store_icon} alt="App Store" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center py-4 text-xs md:text-sm text-white/60 gap-2 md:gap-0">
          <p className="text-center md:text-left">Copyrights ©2025 ThinkCyber.</p>
          <div className="flex gap-4 justify-center md:justify-end">
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
