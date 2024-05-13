import React from 'react';
import ReactDOM from 'react-dom/client';

import { Toaster } from 'react-hot-toast';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './layout';

import Home from './pages/Home';
import Create from './pages/Create';
import Status from './pages/Status';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/videos/create',
    element: (
      <Layout>
        <Create />
      </Layout>
    ),
  },
  {
    path: '/videos/:video/status',
    element: (
      <Layout>
        <Status />
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
