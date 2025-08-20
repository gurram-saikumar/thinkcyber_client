// import React, { useContext } from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import Navbar from './components/student/Navbar'
import Home from './pages/student/Home'
import CourseDetails from './pages/student/CourseDetails' 
import { ToastContainer } from 'react-toastify'
 import MyEnrollments from './pages/student/MyEnrollments'
import Loading from './components/student/Loading'
 import About from './pages/student/About';
import Contact from './pages/student/Contact';
import FAQ from './pages/student/FAQPage';
import WishlistPage from './pages/student/WishlistPage';
import { AppContextProvider } from './context/AppContext';
 import 'quill/dist/quill.snow.css'
import 'react-toastify/dist/ReactToastify.css';
 const App = () => {

  const isEducatorRoute = useMatch('/educator/*');

  return (
    <AppContextProvider>
      <div className="text-default min-h-screen bg-white">
        <ToastContainer />
        {/* Render Student Navbar only if not on educator routes */}
        {!isEducatorRoute && <Navbar />}
        <div id="google_translate_element" /> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course/:id" element={<CourseDetails />} />
             <Route path="/loading/:path" element={<Loading />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/wishlist" element={<WishlistPage />} /> 
          </Routes> 
      </div>
    </AppContextProvider>
  )
}

export default App