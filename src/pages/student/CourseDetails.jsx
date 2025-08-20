import { useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration';
import Loading from '../../components/student/Loading';
import { topicService } from '../../services/apiService';

const CourseDetails = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);
  const { id } = useParams();
  const currency = 'USD';
  const userData = null; // Replace with actual user data if available
  const [courseData, setCourseData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  const fetchCourseData = async () => {
    try {
      const response = await topicService.getTopicById(id);
      if (response && response.data) {
        console.log('Course Data:', response.data);
        setCourseData(response.data);
      } else {
        toast.error('Topic not found');
      }
    } catch (error) {
      toast.error('Failed to fetch topic details');
    }
  }

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const enrollCourse = async () => {
    debugger;
    try {
      if (!userData) {
        return toast.warn('Login to Enroll')
      }

      if (isAlreadyEnrolled) {
        return toast.warn('Already Enrolled')
      }

      // For mock data, just show a success message
      toast.success('Successfully enrolled in the course!');
      setIsAlreadyEnrolled(true);

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [id])

  // useEffect(() => {
  //   if (userData && courseData) {
  //     setIsAlreadyEnrolled(userData.enrolledCourses?.includes(courseData.id) || false)
  //   }
  // }, [userData, courseData])

  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating;
    });

    return Math.floor(totalRating / course.courseRatings.length);
  };

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    if (Array.isArray(course.modules)) {
      course.modules.forEach(module => {
        if (Array.isArray(module.sections)) {
          totalLectures += module.sections.length;
        }
      });
    }
    return totalLectures;
  };

  useEffect(() => {
    if (courseData && courseData.modules && courseData.modules.length > 0) {
      // Only first accordion open
      const initialState = {};
      courseData.modules.forEach((_, idx) => {
        initialState[idx] = idx === 0;
      });
      setOpenSections(initialState);
    }
  }, [courseData]);

  const handleVideoClick = (video) => {
    setModalVideo(video);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setModalVideo(null);
  };

  return courseData ? (
    <>
      <div className="bg-gradient-to-b from-[#457AEE] to-[#83AAFF] flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-20 pt-4 text-left">
        {/* Left Content */} 
        <div className="text-white max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">{courseData.title}</h1>
          <p className="text-sm md:text-base mb-5">
            {courseData.description && courseData.description.length > 300
              ? courseData.description.slice(0, 300) + '...'
              : courseData.description}
          </p>
          <p className="text-md text-white">
            <span className="mr-4">
              <strong>Difficulty:</strong> {courseData.difficulty || "N/A"}
            </span>
            <span className="mr-4">
              <strong>Duration:</strong> {courseData.duration ? `${courseData.duration} hours` : "N/A"}
            </span>
            <span >
              <strong>Last Updated:</strong> {courseData.updatedAt ? new Date(courseData.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
            </span> 
          </p>
          
        </div>
             
        {/* Right Image */}
        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] ">
          <img
            src={courseData.thumbnail}
            alt="Security Illustration"
            className="w-full h-full object-cover"
          />
        </div> 
        </div>
        <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 text-left">

          <div className="z-10 text-gray-500 w-2/3">

            <div className="pt-8 text-gray-800">
              {/* Learning Objectives on top of modules */}
            {courseData.learningObjectives && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded overflow-x-auto">
                <h2 className="text-lg font-semibold text-blue-700 mb-2">What you'll learn</h2>
                <div className="text-gray-700 text-sm">
                  <div className="w-full border border-gray-300 text-left" dangerouslySetInnerHTML={{ __html: courseData.learningObjectives }} />
                </div>
              </div>
            )}  
              <h2 className="text-xl font-semibold">Topic content </h2>
              <p className="text-gray-600 text-sm">
                {courseData.modules?.length || 0} Sections&nbsp;-&nbsp;
                {(() => {
                  // Calculate video count only
                  let videoCount = 0;
                  if (Array.isArray(courseData.modules)) {
                    courseData.modules.forEach(module => {
                      if (Array.isArray(module.videos)) {
                        videoCount += module.videos.length;
                      }
                    });
                  }
                  return `${videoCount} Videos`;
                })()}
              </p>
              <div className="pt-5">
                {courseData.modules && courseData.modules.map((module, moduleIdx) => (
                  <div key={moduleIdx} className="border border-gray-300 bg-white mb-2 rounded">
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-[#F7F9FD]"
                      onClick={() => toggleSection(moduleIdx)}
                    >
                      <div className="flex items-center gap-2 ">
                        <img src={assets.down_arrow_icon} alt="arrow icon" className={`transform transition-transform ${openSections[moduleIdx] ? "rotate-180" : ""}`} />
                        <p className="font-medium md:text-base text-sm">{module.title || module.name || `Module ${moduleIdx + 1}`}</p>
                      </div>
                      <p className="text-sm md:text-default">{module.duration ? `${module.duration} min` : ''}</p>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${openSections[moduleIdx] ? "max-h-96" : "max-h-0"}`} style={{ display: openSections[moduleIdx] ? 'block' : 'none' }}>
                      {/* Module Description (only visible when open) */}
                    {module.description && (
                      <div className="px-4 py-2 text-gray-700 text-sm border-t border-gray-200">
                        {module.description}
                      </div>
                    )}
                    {/* Module Videos */}
                    {Array.isArray(module.videos) && module.videos.length > 0 && (
                      <div className="px-4 py-2">
                        <h3 className="text-base font-semibold mb-2">Videos</h3>
                        <div className="flex flex-col gap-2">
                          {module.videos.map((video, vidx) => (
                            <div
                              key={vidx}
                              className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded hover:bg-gray-100 transition-all"
                              onClick={() => handleVideoClick(video)}
                              title={video.title || 'Watch Video'}
                            >
                              <img src={assets.play_icon} alt="Play" className="w-6 h-6" />
                              <span className="text-gray-800 text-base font-medium">
                                {video.title || 'Watch Video'}
                              </span>
                              {video.duration && (
                                <span className="ml-2 text-gray-500 text-sm font-normal">
                                  {video.duration} mins
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="border-t border-gray-300">
                      {module.sections && module.sections.map((section, i) => (
                        <div key={i} className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-all">
                          <div className="flex items-center gap-3">
                            <button
                              className="focus:outline-none"
                              onClick={() => handleVideoClick({ videoUrl: section.video, title: section.title })}
                              title="Play Video"
                            >
                              <img src={assets.play_icon} alt="Play" className="w-6 h-6" />
                            </button>
                            <span className="text-gray-800 text-base font-medium">
                              {section.title || section.name || section}
                            </span>
                          </div>
                          <span className="text-gray-700 text-sm font-normal">
                            {section.duration ? `${section.duration} mins` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div> 
          </div> 
          <div className="pt-8 pb-8">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Description</h2>
          <div className="px-0 py-2 text-gray-700 text-sm border-t border-gray-200">
            <div className="w-full border border-gray-300 text-left" dangerouslySetInnerHTML={{ __html: courseData.description }} />
          </div> 
          </div>
        </div>
 
        <div className="max-w-course-card z-10 shadow-custom-card overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
           <div className="p-5">   
            <button onClick={enrollCourse} className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium">
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>
            <div className="pt-6"> 
              <div className='mt-0 mb-4'>
          <div className="inline-block px-2 py-1 rounded bg-yellow-400 text-black text-xs font-semibold align-middle">
                {courseData.categoryName || "No Category"} /  {courseData.subcategoryName || "No Subcategory"}
            </div> 
        </div>
              {courseData.prerequisites && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-800 mb-1">Prerequisites</p>
                  <ul className="list-disc ml-5 text-sm text-gray-600">
                    {Array.isArray(courseData.prerequisites)
                      ? courseData.prerequisites.map((pre, idx) => <li key={idx}>{pre}</li>)
                      : <li>{courseData.prerequisites}</li>}
                  </ul>
                </div>
              )}
            
              <div className="mt-6 border-t pt-4">
                <p className="font-semibold text-gray-800 mb-4 text-lg">Topic Details</p>
                <div className="p-0">
                  {/* Target and Audience split into separate lines */}
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Target</span>
                    <span>🏢 Business Owners, 🧑‍🤝‍🧑 Parents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Audience:</span>
                    <span>🧒 Children, 🧑‍🏫 Educators</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-semibold">Created:</span>
                    <span>{courseData.createdAt ? new Date(courseData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
                  </div>
                  {courseData.isFeatured ? (
                    <div className="flex items-center gap-2 text-sm text-gray-700 mt-4">
                      <span className="font-bold text-lg">Price:</span>
                      <span>{courseData.price ? `$${courseData.price}` : 'N/A'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="font-semibold">Free:</span>
                      <span>{courseData.isFree ? 'Yes' : 'No'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Video Modal */}
      {showVideoModal && modalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-xl w-full">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
              onClick={closeVideoModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">{modalVideo.title || 'Video'}</h3>
            <div className="flex items-center justify-center">
              {modalVideo.videoUrl && (
                modalVideo.videoUrl.includes('youtube.com') || modalVideo.videoUrl.includes('youtu.be') ? (
                  <iframe
                    width="420"
                    height="240"
                    src={`https://www.youtube.com/embed/${modalVideo.videoUrl.split('v=')[1] || modalVideo.videoUrl.split('/').pop()}`}
                    title={modalVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video controls width="420">
                    <source src={modalVideo.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  ) : <Loading />
};

export default CourseDetails;