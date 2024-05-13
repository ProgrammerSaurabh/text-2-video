import { Button } from '@headlessui/react';
import React from 'react';
import { FaLocationArrow } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Cta = ({ text = 'Try now' }) => {
  return (
    <Link to={'/videos/create'}>
      <Button className='flex gap-3 items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 border-b-violet-700 border-b-4 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg ml-3'>
        <span>{text}</span>
        <FaLocationArrow />
      </Button>
    </Link>
  );
};

export default Cta;
