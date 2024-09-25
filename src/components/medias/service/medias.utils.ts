import { PUBLIC_SERVER_URL } from '../../../config';
import { MediaDTO, MediaProperties } from './medias.types';
import ffmpeg from 'fluent-ffmpeg';
import ffprobe from '@ffprobe-installer/ffprobe';
import sharp from 'sharp';

ffmpeg.setFfprobePath(ffprobe.path);

export const convertContentKeyToUrl = (media: MediaDTO): MediaDTO => ({
  ...media,
  content: `${PUBLIC_SERVER_URL}/v1/static/${media.content}`,
});

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
