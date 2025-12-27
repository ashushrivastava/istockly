// frontend/src/pages/HomePage.jsx
// Main homepage component

import React from 'react';
import Home from '../components/Home';
import Partners from '../components/Partners';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

const HomePage = () => {
  return (
    <div>
      <Home />
      <Partners />
      <Features />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default HomePage;