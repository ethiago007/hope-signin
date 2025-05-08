import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import SignUp from "./component/signup";
import Login from "./component/login";
import DummyPage from "./component/dummy";
import UnderwaterBackground from "./component/UnderwaterBackground";
import Preloader from "./component/loader";
import UnsplashGallery from "./component/gallery"
import './App.css'
const AppWrapper = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 6000); 
  }, []);

  useEffect(() => {
    if (navigationType !== "POP") {
      setLoading(true);
      setTimeout(() => setLoading(false), 6000); 
    }
  }, [location]);

  return (
    <>
      {loading && <Preloader />}
      {!loading && (
        <>
          
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dummy" element={<DummyPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/gallery" element={<UnsplashGallery />} />
          </Routes>
        </>
      )}
    </>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;