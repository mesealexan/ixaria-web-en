import manifest from '../data/responsive-images.json';

const images: Record<string, { width: number; height: number; srcset: string }> = manifest;

export const serviceImageSizes = '(max-width: 768px) calc(100vw - 40px), (max-width: 1050px) calc((100vw - 100px) / 2.1), (max-width: 1160px) calc((100vw - 128px) / 2.1), 492px';
export const wideImageSizes = '(max-width: 768px) calc(100vw - 40px), (max-width: 1160px) calc(100vw - 64px), 1096px';
export const teamImageSizes = '(max-width: 768px) calc(100vw - 32px), (max-width: 1160px) calc((100vw - 112px) / 3), 350px';

export function responsiveImage(src: string, sizes: string) {
  const image = images[decodeURIComponent(src)];
  return image ? { srcset: image.srcset, sizes } : {};
}
