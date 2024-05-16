#!/bin/bash

# Change directory to the backend project
cd ./frontend

# Start the backend
npm start &

# Change directory to the frontend project
cd ../backend

# Start the frontend
npm start
