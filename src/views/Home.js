import React from 'react';
// import sections
import Hero from '../components/landing/sections/Hero';
import FeaturesTiles from '../components/landing/sections/FeaturesTiles';
import FeaturesSplit from '../components/landing/sections/FeaturesSplit';
import Testimonial from '../components/landing/sections/Testimonial';
import Cta from '../components/landing/sections/Cta';

const Home = () => {

  return (
    <>
      <Hero className="illustration-section-01" />
      <FeaturesTiles />
      <FeaturesSplit invertMobile topDivider imageFill className="illustration-section-02" />
      <Testimonial topDivider />
      <Cta split />
    </>
  );
}

export default Home;