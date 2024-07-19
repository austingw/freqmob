import sharp from "sharp";

export const convertImage = async (imageBuffer: Buffer, size: number) => {
  return await sharp(imageBuffer).resize(size, size).toFormat("jpg").toBuffer();
};
