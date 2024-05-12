import React from 'react';

import { Button } from '@headlessui/react';
import { FaLocationArrow } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import HeroImage from '../../assets/hero.svg';

const Home = () => {
  return (
    <div className='flex flex-col-reverse lg:flex-row justify-center md:justify-between gap-5 md:gap-0 items-center container mx-auto min-h-screen'>
      <div className='text-center md:text-left text-white px-5 md:px-0 flex flex-col justify-center items-center md:items-start gap-4'>
        <h1 className='text-6xl md:text-8xl font-bold [text-shadow:5px_5px_5px_var(--tw-shadow-color)] shadow-green-500'>
          Transform Text into <br className='hidden lg:block' />
          Stunning Videos
        </h1>
        <p className='text-3xl mb-2 ml-0 md:ml-3'>
          Create captivating{' '}
          <span className='border-b-[6px] border-green-500 font-extrabold'>
            video
          </span>{' '}
          content from your{' '}
          <span className='border-b-[6px] border-green-500 font-extrabold'>
            words
          </span>
          .
        </p>
        <Link to={'/video/create'}>
          <Button className='flex gap-3 items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 border-b-violet-700 border-b-4 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg ml-3'>
            <span>Try now</span>
            <FaLocationArrow />
          </Button>
        </Link>
      </div>
      <div className='flex flex-col justify-center items-start md:h-full'>
        <img
          src={HeroImage}
          className='h-[300px] md:h-[400px]'
        />
      </div>
    </div>
  );
};

export default Home;
