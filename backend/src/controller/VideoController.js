const FrameModel = require('../db/models/frame');
const VideoModel = require('../db/models/video');
const JobModel = require('../db/models/job');

const {
  STATUSES,
  makeDirs,
  downloadAudio,
  saveSampleAudio,
  generateFrame,
} = require('../helpers');

exports.store = async (req, res) => {
  try {
    const frames = req.body;

    try {
      const video = new VideoModel({
        framesCount: frames.length,
        status: STATUSES.PROGRESS,
      });

      const savedVideo = await video.save();

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
      res.status(500).json({
        success: false,
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
        message: `Video #${video?._id} is in progress`,
      });
    }

    if (video?.status === STATUSES.COMPLETED) {
      res.json({
        success: true,
        message: `Video #${video?._id} has been completed`,
      });
    }

    if (video?.status === STATUSES.FAILED) {
      res.json({
        success: false,
        message: `Video #${video?._id} has been completed`,
      });
    }

    res.status(500).json({
      success: false,
      message: `Something went wrong`,
    });
  } catch (error) {}
};
