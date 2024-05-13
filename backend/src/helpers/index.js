const fs = require('fs');

const axios = require('axios');

const { createCanvas, loadImage } = require('canvas');

const { exec } = require('child_process');

const { default: getAudioDurationInSeconds } = require('get-audio-duration');

const VideoModel = require('../db/models/video');
const JobModel = require('../db/models/job');
const archiver = require('archiver');

const STATUSES = {
  PROGRESS: 0,
  COMPLETED: 1,
  FAILED: 2,
};

const framesDir = './src/assets/frames';
const videosDir = './src/assets/videos';
const audiosDir = './src/assets/audios';
const processedDir = './src/assets/processed';
const outputDir = './src/assets/outputs';
const audioFile = './src/assets/audios/silence.aac';

const makeDirs = async (videoId = null) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(`${framesDir}/${videoId ?? ''}`)) {
        fs.mkdirSync(`${framesDir}/${videoId ?? ''}`);
      }

      if (!fs.existsSync(`${videosDir}/${videoId ?? ''}`)) {
        fs.mkdirSync(`${videosDir}/${videoId ?? ''}`);
      }

      if (!fs.existsSync(`${audiosDir}/${videoId ?? ''}`)) {
        fs.mkdirSync(`${audiosDir}/${videoId ?? ''}`);
      }

      if (!fs.existsSync(`${processedDir}/${videoId ?? ''}`)) {
        fs.mkdirSync(`${processedDir}/${videoId ?? ''}`);
      }

      if (!fs.existsSync(`${outputDir}/${videoId ?? ''}`)) {
        fs.mkdirSync(`${outputDir}/${videoId ?? ''}`);
      }

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const downloadAudio = async (url, filename) => {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filename);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Failed to download audio from ${url}: ${error.message}`);
  }
};

const saveSampleAudio = async (path) => {
  fs.copyFile(audioFile, path, (err) => {
    if (err) {
      throw err;
    }
  });
};

const generateFrame = async (
  videoId,
  texts,
  images,
  includeImage,
  backgroundType,
  background,
  index
) => {
  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext('2d');

  if (backgroundType === 'image') {
    const image = await loadImage(background);

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = background;

    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const fontFamily = 'Roboto';

  texts?.forEach((text) => {
    ctx.font = `${text.size}px ${fontFamily}`;

    ctx.fillStyle = text.color;

    drawMultilineText(ctx, text.content, text.x, text.y, canvas.width - 80, 40);
  });

  if (includeImage && images?.length > 0) {
    images?.forEach(async (image) => {
      const loadedImage = await loadImage(image.url);

      ctx.drawImage(loadedImage, image.x, image.y, image.width, image.height);

      saveFrameImage(canvas, index, videoId);
    });
  } else {
    saveFrameImage(canvas, index, videoId);
  }
};

const drawMultilineText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(' ');
  let line = '';
  let yOffset = parseInt(y);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, yOffset);
      line = word + ' ';
      yOffset += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, yOffset);
};

const saveFrameImage = (canvas, index, videoId) => {
  const filename = `${index}.png`;
  const out = fs.createWriteStream(`${framesDir}/${videoId}/${filename}`);

  const stream = canvas.createPNGStream();

  stream.pipe(out);

  return filename;
};

const saveVideo = async (index, cb, videoId) => {
  return new Promise(async (resolve, reject) => {
    const durationInSeconds = await getAudioDurationInSeconds(
      `${audiosDir}/${videoId}/${index}.aac`
    );

    const frameRate = 30;

    const inputPattern = `${framesDir}/${videoId}/${index}.png`;
    const outputFileName = `${videosDir}/${videoId}/${index}.mp4`;

    const ffmpegCommand = `ffmpeg -y -loop 1 -framerate ${frameRate} -i ${inputPattern} -t ${durationInSeconds} ${outputFileName}`;

    exec(ffmpegCommand, (error) => {
      if (error) {
        console.error(`Video save error: ${error.message}`);
        return reject(error);
      }

      cb(index, videoId);

      return resolve();
    });
  });
};

const mergeAudioVideo = async (index, videoId) => {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = `ffmpeg -i ./src/assets/videos/${videoId}/${index}.mp4 -i ./src/assets/audios/${videoId}/${index}.aac -c:v copy -c:a copy -map 0:v -map 1:a -y -strict -1 ${processedDir}/${videoId}/${index}.mp4`;

    exec(ffmpegCommand, (error) => {
      if (error) {
        console.error(`Merge audio-video error: ${error.message}`);
        return reject(error);
      }

      return resolve();
    });
  });
};

const mergeVideos = async (videos, videoId) => {
  return new Promise((resolve, reject) => {
    let command = 'ffmpeg -y';

    videos.forEach((video) => {
      command += ` -i ${video}`;
    });

    command = `${command} ${outputDir}/${videoId}.mp4`;

    exec(command, (error) => {
      if (error) {
        console.error(`Generate video error: ${error.message}`);

        reject(error);
      }

      resolve();
    });
  });
};

const processVideo = async (videoId, jobModel = null) => {
  let video = null;

  try {
    video = await VideoModel.findById(videoId);

    if (
      !video ||
      video?.framesCount == 0 ||
      video?.status == STATUSES.COMPLETED ||
      video?.status == STATUSES.FAILED
    ) {
      return;
    }

    const videos = [];

    for (let i = 0; i < video?.framesCount; i++) {
      await saveVideo(i, mergeAudioVideo, video?._id);

      videos.push(`${processedDir}/${video?._id}/${i}.mp4`);
    }

    // await mergeVideos(videos, video?._id);

    await VideoModel.updateOne(
      {
        _id: video._id,
      },
      {
        $set: {
          status: STATUSES.COMPLETED,
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
          status: STATUSES.COMPLETED,
          updatedAt: Date.now(),
        },
      }
    );
  } catch (err) {
    console.log({ error: `Error processing Video #${videoId}: ${err}` });
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
  }
};

const makeZip = (res, videoId) => {
  const archive = archiver('zip', { zlib: { level: 9 } });

  res.attachment(`${videoId}.zip`);

  res.setHeader('Content-Type', 'application/zip');

  archive.pipe(res);

  archive.directory(`${processedDir}/${videoId}`, `${videoId}`);

  archive.finalize();
};

module.exports = {
  STATUSES,
  framesDir,
  videosDir,
  audiosDir,
  processedDir,
  audioFile,
  makeDirs,
  downloadAudio,
  saveSampleAudio,
  generateFrame,
  saveVideo,
  mergeAudioVideo,
  mergeVideos,
  processVideo,
  makeZip,
};
