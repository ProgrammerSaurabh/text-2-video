import React from 'react';

import { Button } from '@headlessui/react';
import { FaLocationArrow } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import HeroImage from '../../assets/hero.svg';
import Cta from '../../components/Cta';

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
        <Cta />
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
