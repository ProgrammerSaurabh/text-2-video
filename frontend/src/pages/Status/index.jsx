import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import {
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
  IoIosAlert,
} from 'react-icons/io';

import { HiOutlineDownload } from 'react-icons/hi';

import CompletedImage from '../../assets/completed.svg';
import FailedImage from '../../assets/failed.svg';
import ProgressImage from '../../assets/progress.svg';
import Cta from '../../components/Cta';
import { Button } from '@headlessui/react';

const Status = () => {
  const { video } = useParams();
  const [response, setResponse] = useState({});

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/${video}/status`
        );

        setResponse(data);

        if (data?.success) {
          toast.success(data?.message);
        }
      } catch (error) {
        if (error?.message) {
          toast.error(error?.message);
        }
      }
    };

    if (video) {
      loadStatus();
    }
  }, [video]);

  const download = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/${video}/download`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', `${video}.zip`);

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      toast.success('Downloaded successfully');
    } catch (error) {
      if (error?.message) {
        toast.error(error?.message);
      }
    }
  };

  return (
    <div className='container mx-auto h-full py-10 px-4'>
      <div className='bg-white rounded-lg shadow-lg p-8 w-full text-center'>
        <div className='flex flex-row gap-2 items-center justify-center mb-4'>
          <h2 className='text-5xl font-semibold text-gray-800'>Video status</h2>
          <div>
            {response?.status == 1 && (
              <IoIosCheckmarkCircle
                size={50}
                className='text-green-600'
              />
            )}
            {response?.status == 2 && (
              <IoIosCloseCircle
                size={50}
                className='text-rose-600'
              />
            )}
            {response?.status == 0 && (
              <IoIosAlert
                size={50}
                className='text-blue-600'
              />
            )}
          </div>
        </div>
        <div className='flex flex-col justify-center items-center md:h-full mb-6'>
          <img
            src={
              response?.status == 1
                ? CompletedImage
                : response?.status == 2
                ? FailedImage
                : ProgressImage
            }
            className='h-[300px] md:h-[400px]'
          />
        </div>

        <p
          className={`text-lg mb-4 ${
            response?.status == 1
              ? 'text-green-600'
              : response?.status == 2
              ? 'text-rose-500'
              : 'text-blue-500'
          }`}
        >
          {response?.message}
        </p>

        <div className='flex flex-row gap-4 justify-center'>
          {response?.status == 1 && (
            <>
              <Button
                className={
                  'flex gap-3 items-center px-8 py-4 bg-green-600 border-b-green-700 border-b-4 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg ml-3'
                }
                onClick={download}
              >
                <span>Download now</span>
                <HiOutlineDownload size={25} />
              </Button>
            </>
          )}
          <Cta
            text={`${
              response?.status == 1
                ? 'Try another'
                : response?.status == 2
                ? 'Try again'
                : 'Make new'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Status;
