const FrameModel = require('../db/models/frame');
const VideoModel = require('../db/models/video');
const JobModel = require('../db/models/job');

const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const {
  STATUSES,
  makeDirs,
  downloadAudio,
  saveSampleAudio,
  generateFrame,
  processedDir,
  makeZip,
} = require('../helpers');

exports.store = async (req, res) => {
  try {
    const frames = req.body;

    let savedVideo = null;

    try {
      const video = new VideoModel({
        framesCount: frames.length,
        status: STATUSES.PROGRESS,
      });

      savedVideo = await video.save();

      for (const frameData of frames) {
        const frame = new FrameModel({
          videoId: savedVideo._id,
          ...frameData,
        });

        await frame.save();
      }

      await makeDirs(savedVideo._id);

      const job = new JobModel({
        videoId: savedVideo._id,
        status: STATUSES.PROGRESS,
      });

      frames?.forEach(async (frame, index) => {
        const {
          texts,
          includeImage,
          images,
          backgroundType,
          background,
          audioUrl,
        } = frame;

        try {
          const audioFilePath = `./src/assets/audios/${savedVideo._id}/${index}.aac`;

          if (audioUrl) {
            await downloadAudio(audioUrl, audioFilePath);
          } else {
            saveSampleAudio(audioFilePath);
          }

          await generateFrame(
            savedVideo._id,
            texts,
            images,
            includeImage,
            backgroundType,
            background,
            index
          );
        } catch (error) {
          console.log({ error });
          await VideoModel.updateOne(
            {
              _id: video._id,
            },
            {
              $set: {
                status: STATUSES.FAILED,
                updatedAt: Date.now(),
              },
            }
          );

          await JobModel.updateOne(
            {
              videoId: jobModel.videoId,
            },
            {
              $set: {
                status: STATUSES.FAILED,
                updatedAt: Date.now(),
              },
            }
          );
          // res.status(500).json({ error: 'Failed to generate content' });
        }
      });

      await job.save();

      res.status(201).json({
        success: true,
        id: savedVideo._id,
        message: 'Data saved successfully',
      });
    } catch {
      await VideoModel.updateOne(
        {
          _id: video._id,
        },
        {
          $set: {
            status: STATUSES.FAILED,
            updatedAt: Date.now(),
          },
        }
      );

      await JobModel.updateOne(
        {
          videoId: jobModel.videoId,
        },
        {
          $set: {
            status: STATUSES.FAILED,
            updatedAt: Date.now(),
          },
        }
      );

      res.status(500).json({
        success: false,
        id: savedVideo?._id,
        message: `Something went wrong`,
      });
    }
  } catch (error) {
    console.log({ error });
  }
};

exports.status = async (req, res) => {
  try {
    const videoId = req.params.video;

    let video = null;

    try {
      video = await VideoModel.findById(videoId);
    } catch (err) {
      res.status(404).send({
        success: false,
        message: 'Video not found',
      });
    }

    if (video?.status === STATUSES.PROGRESS) {
      res.json({
        success: false,
        status: STATUSES.PROGRESS,
        message: `Video #${video?._id} is in progress`,
      });
    }

    if (video?.status === STATUSES.COMPLETED) {
      res.json({
        success: true,
        status: STATUSES.COMPLETED,
        message: `Video #${video?._id} has been completed`,
      });
    }

    if (video?.status === STATUSES.FAILED) {
      res.json({
        success: false,
        status: STATUSES.FAILED,
        message: `Video #${video?._id} has been completed`,
      });
    }

    res.status(500).json({
      success: false,
      message: `Something went wrong`,
    });
  } catch (error) {}
};

exports.download = async (req, res) => {
  try {
    const videoId = req.params.video;

    let video = null;

    try {
      video = await VideoModel.findById(videoId);
    } catch (err) {
      res.status(404).send({
        success: false,
        message: 'Video not found',
      });
    }

    if (video?.status === STATUSES.PROGRESS) {
      res.json({
        success: false,
        status: STATUSES.PROGRESS,
        message: `Video #${video?._id} is in progress`,
      });
    }

    if (video?.status === STATUSES.FAILED) {
      res.json({
        success: false,
        status: STATUSES.FAILED,
        message: `Video #${video?._id} has been completed`,
      });
    }

    if (video?.status === STATUSES.COMPLETED) {
      makeZip(res, video?._id);
    }

    // res.status(500).json({
    //   success: false,
    //   message: `Something went wrong`,
    // });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      success: false,
      message: `Something went wrong`,
    });
  }
};
