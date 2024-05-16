import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className='bg-gradient-to-b from-purple-500 via-pink-500 to-red-500 min-h-screen py-10'>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
