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
    <footer className="bg-gray-900 md:px-36 text-left w-full ">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">

        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo_dark} alt="logo" className="w-32" />
          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            ThinkCyber education, built specifically for the education centers which is dedicated to teaching and involving learners.
          </p>
          <div className="flex gap-4 mt-4">
            <img src={assets.instagram_icon} alt="Instagram" className="w-10 h-10 bg-white p-0 rounded-full" />
            <img src={assets.twitter_icon} alt="Twitter" className="w-10 h-10 bg-white p-0 rounded-full" />
            <img src={assets.facebook_icon} alt="LinkedIn" className="w-10 h-10 bg-white p-0 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li><a href="/about">About us</a></li>
            <li><a href="/contact">Contact us</a></li> 
          </ul>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Community</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li><a href="#">Documentation</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Contact</h2>
          <p className="text-sm text-white/80">{contact.phone}</p>
          <p className="text-sm text-white/80">Email: {contact.email}</p>
          <p className="text-sm text-white/80">Address: {contact.address}</p>
          <div className="flex gap-4 mt-4">
            <img src={assets.google_play_icon} alt="Google Play" />
            <img src={assets.app_store_icon} alt="App Store" />
          </div>
        </div>

      </div>
      <div className="flex flex-col md:flex-row justify-between items-center py-4 text-xs md:text-sm text-white/60">
        <p>Copyrights ©2025 ThinkCyber.</p>
        <div className="flex gap-4">
           <a href="#">Terms of use</a>
          <a href="#">Privacy policy</a>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
