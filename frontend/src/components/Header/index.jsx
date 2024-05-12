import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='bg-white p-4 border-b-gray-100 fixed w-full play-bold z-10 rounded-bl-lg rounded-br-lg'>
      <div className='container mx-auto'>
        <Link to={'/'}>
          <h5 className='text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-300% text-transparent bg-clip-text animate-gradient'>
            Text-2-Video
          </h5>
        </Link>
      </div>
    </header>
  );
};

export default Header;
