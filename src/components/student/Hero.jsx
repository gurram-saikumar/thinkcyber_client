import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { assets } from '../../assets/assets';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { homepageService, topicService } from '../../services/apiService';
import Loading from './Loading';
import { toast } from 'react-toastify';

const Hero = () => {
  const navigate = useNavigate();
  const [homepageData, setHomepageData] = useState(null);
  const [topicsData, setTopicsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useSlider, setUseSlider] = useState(true);
  const [wishlist, setWishlist] = useState(() => {
    // Load wishlist from localStorage on mount
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [wishlistMsg, setWishlistMsg] = useState('');

  // Fetch homepage data and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      debugger;
      try {
        setLoading(true);
        debugger;
        // Fetch homepage data and topics in parallel
        const [homepageResponse, topicsResponse] = await Promise.all([
          homepageService.getHomepageByLanguage('en').catch(() => null),
          topicService.getAllTopics({ limit: 6 }).catch(() => ({ data: [] }))
        ]);

        setHomepageData(homepageResponse);
        setTopicsData(topicsResponse?.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true, 
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: (
    <button className="slick-next slick-arrow absolute top-4 right-4 z-10 bg-white text-black p-2 rounded-full shadow">
    &#8250;
    </button>
    ),
    prevArrow: (
    <button className="slick-prev slick-arrow absolute top-4 right-16 z-10 bg-white text-black p-2 rounded-full shadow">
    &#8249;
    </button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          variableWidth: false,
        },
      },
    ],
  };

  // Component to render topics - either as slider or grid
  const TopicsDisplay = ({ topics }) => {
    // Check if topic is in wishlist
    const isInWishlist = (topicId) => wishlist.some((item) => item.id === topicId);

    // Handle heart click: add/remove topic from wishlist and navigate to Wishlist page
    const handleWishlistClick = (topic) => {
      if (isInWishlist(topic.id)) {
        setWishlist(wishlist.filter((item) => item.id !== topic.id));
      } else {
        setWishlist([...wishlist, topic]);
        toast.warn('Topic added to your wishlist!') 
        setTimeout(() => setWishlistMsg(''), 1500);
      }
    };

    const TopicCard = ({ topic }) => (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mx-2 my-4 relative min-h-[180px] w-full max-w-full flex flex-col sm:min-w-[220px] sm:max-w-xs">
        {/* Heart icon top-right (clickable, filled if in wishlist) */}
        <span
          className="absolute top-3 right-3 text-red-500 text-xl cursor-pointer"
          onClick={() => handleWishlistClick(topic)}
          title={isInWishlist(topic.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {isInWishlist(topic.id) ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="red" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 17.5l-1.45-1.32C4.4 12.36 1 9.28 1 6.5A4.5 4.5 0 0 1 5.5 2c1.54 0 3.04.99 3.57 2.36h1.87C11.46 2.99 12.96 2 14.5 2A4.5 4.5 0 0 1 19 6.5c0 2.78-3.4 5.86-7.55 9.68L10 17.5z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 17.5l-1.45-1.32C4.4 12.36 1 9.28 1 6.5A4.5 4.5 0 0 1 5.5 2c1.54 0 3.04.99 3.57 2.36h1.87C11.46 2.99 12.96 2 14.5 2A4.5 4.5 0 0 1 19 6.5c0 2.78-3.4 5.86-7.55 9.68L10 17.5z" />
            </svg>
          )}
        </span>
        <div className="flex flex-col items-start justify-start h-[70px] mb-2">
          <img src={topic.icon} alt={topic.title} className="w-14 h-14 object-contain" />
        </div>
        <div className={`border-l-4 ${topic.borderColor} pl-3 flex-1`}>
          <h3 className={`text-md w-full font-bold mb-1 ${topic.textColor} leading-tight`}>{topic.title}</h3>
          <p className="text-base text-gray-600 mb-0 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {topic.description}
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="text-white font-bold px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-sm shadow"
            onClick={() => navigate(`/course/${topic.id}`)}
          >
            View more
          </button>
        </div>
      </div>
    );

    // If only one topic, always use grid layout for left alignment
    if (topics.length === 1) {
      return (
        <div className="grid grid-cols-1 gap-6">
          <TopicCard key={topics[0].id} topic={topics[0]} />
        </div>
      );
    }
    // Otherwise use slider if enabled
    if (useSlider && Slider) {
      try {
        return (
          <Slider {...sliderSettings} className="gap-10">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </Slider>
        );
      } catch (error) {
        console.warn('Slider failed, falling back to grid:', error);
        setUseSlider(false);
      }
    }
    // Fallback grid layout for multiple topics
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    );
  };
  // Transform topics data for the display
  const topics = topicsData.slice(0, 6).map((topic, index) => ({
    id: topic.id || (index + 1).toString().padStart(2, '0'),
    title: topic.name || topic.title || `Topic ${index + 1}`,
    description: topic.description || `Description for ${topic.name || 'topic'}`,
    icon: topic.icon || (index % 3 === 0 ? assets.basic_security_icon : 
                         index % 3 === 1 ? assets.business_owner_icon : 
                         assets.follower_icon),
    borderColor: index % 3 === 0 ? "border-blue-600" : 
                 index % 3 === 1 ? "border-[#146DA5]" : "border-[#039198]",
    textColor: index % 3 === 0 ? "text-blue-600" : 
               index % 3 === 1 ? "text-[#146DA5]" : "text-[#039198]",
  }));

  // Default content for fallback
  const defaultContent = {
    title: "LEADING THE WAY",
    description: "Our company provides top-quality knowledge on digital and cyber security that can help to meet the needs of people – which can be different audience. We have a proven track record of success in the industry and are committed to exceeding expectations. With a team of experienced professionals and cutting-edge technology, we are well-equipped to deliver results that matter.",
    subtitle: "In today's fast-paced business environment, it's essential to stay ahead on security. That's why our company is always looking for ways to innovate and improve our products and services."
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  console.log('Homepage Data:', homepageData);

  return (
    <div className="flex flex-col items-start justify-start w-full md:pt-10 pt-0 md:px-0 space-y-0 text-left bg-white">
      {/* Header with Wishlist Heart Icon */}
      <div className="px-4 md:px-10 w-full">
        <h1
          className="relative font-bold max-w-3xl mx-auto md:mx-10 text-[32px] md:text-[46px] leading-tight md:leading-[54px] font-heebo text-[#24292D] text-center md:text-left mt-6 md:mt-0"
        >
          {homepageData?.hero?.title || defaultContent.title}
        </h1>
        <p className="block text-black max-w-full mx-auto md:mx-10 pt-4 md:pt-10 font-outfit text-[15px] md:text-[16px] font-medium leading-[22px] md:leading-[28px] text-center md:text-left">
          {homepageData?.hero?.description || defaultContent.description}
        </p>
        <p className="text-black max-w-full mx-auto md:mx-10 py-2 md:py-4 mt-2 md:mt-4 font-outfit text-[15px] md:text-[16px] font-medium leading-[22px] md:leading-[28px] text-center md:text-left">
          {homepageData?.hero?.subtitle || defaultContent.subtitle}
        </p>
        <div className='h-4 md:h-8'/>
      </div>

      {/* Most Popular Topics Section */}
      {topics.length > 0 && (
        <div className="px-4 md:px-10 bg-gradient-to-r w-full from-[rgba(69,122,238,0)] to-[rgba(0,40,128,1)]">
          <h1 className="pt-6 md:p-7 pb-0 font-bold text-gray-800 mb-2 md:mb-4 text-[22px] md:text-home-heading-large text-center md:text-left">
            {homepageData?.sections?.popularTopics?.title || "Most Popular Topics"}
          </h1>
          <p className="pb-0 pt-0 text-[15px] md:text-lg text-gray-500 mb-4 md:mb-6 text-center md:text-left">
            {homepageData?.sections?.popularTopics?.subtitle || "Choose from hundreds of topics from specialist organizations"}
          </p>
          <div className="relative"> 
            <TopicsDisplay topics={topics} />
          </div>
          <div className='h-4 md:h-8'/>
        </div>
      )}
    </div>
  );
};

export default Hero;
