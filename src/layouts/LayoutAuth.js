import React from 'react';
import Header from '../components/landing/layout/Header';
import Footer from '../components/landing/layout/Footer';
import "../App.css";

const LayoutDefault = ({ children }) => (
  <>
    <Header navPosition="right" className="reveal-from-bottom" />
    <main className="container mt-3">
      {children}
    </main>
    <Footer />
  </>
);

export default LayoutDefault;  