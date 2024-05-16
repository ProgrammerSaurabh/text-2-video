import React from 'react';

import { FaRegCopyright } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='p-2 fixed bottom-0 w-full play-bold rounded-bl-lg rounded-br-lg text-white'>
      <p className='flex gap-1 items-center justify-center'>
        <span>
          <FaRegCopyright />
        </span>{' '}
        <span>{new Date().getFullYear()}</span>
        <span>Text-2-Video</span>
        <span>All rights reserved.</span>
      </p>
    </footer>
  );
};

export default Footer;
