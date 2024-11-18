import { PUBLIC_SERVER_URL, IMAGE_THUMBNAILS_WIDTH } from '../../../config';
import { MediaContent, MediaProperties } from './medias.types';
import ffmpeg from 'fluent-ffmpeg';
import ffprobeBin from '@ffprobe-installer/ffprobe';
import ffmpegBin from '@ffmpeg-installer/ffmpeg';
import sharp from 'sharp';

ffmpeg.setFfprobePath(ffprobeBin.path);
ffmpeg.setFfmpegPath(ffmpegBin.path);

const VIDEO_TIME_PERCENT_FOR_THUMBNAIL = 10;

export const convertContentKeyToUrl = (content: MediaContent): string => `${PUBLIC_SERVER_URL}/v1/static/${content}`;

export const getVideoProperties = (filePath: string): Promise<MediaProperties> => new Promise((resolve, reject) => {
  ffmpeg(filePath).ffprobe((err, metadata) => {
    if (err) {
      reject(err);
    }

    return resolve({
      width: metadata.streams[0].width,
      height: metadata.streams[0].height,
      duration: metadata.format.duration
    });
  });
});

export const getImageProperties = async (buffer: Buffer): Promise<MediaProperties> => {
  const sharpImage = await sharp(buffer);

  const { width = null, height = null } = await sharpImage.metadata();

  return { width, height, duration: null };
};

export const createVideoThumbnail = async ({ sourcePath, destinationFolder, filename }): Promise<string> => new Promise((resolve, reject) => ffmpeg(sourcePath)
  .screenshots({
    size: `${IMAGE_THUMBNAILS_WIDTH}x?`,
    folder: destinationFolder,
    timestamps: [`${VIDEO_TIME_PERCENT_FOR_THUMBNAIL}%`],
    filename,
  })
  .on('end', () => resolve(filename))
  .on('error', reject));

export const createImageThumbnail = async ({ sourcePath, destinationFolder, filename }): Promise<string> => {
  const sharpImage = sharp(sourcePath);

  const { width } = await sharpImage.metadata();

  await sharpImage.resize(Math.min(width || IMAGE_THUMBNAILS_WIDTH, IMAGE_THUMBNAILS_WIDTH)).toFile(`${destinationFolder}/${filename}`);

  return filename;
};
