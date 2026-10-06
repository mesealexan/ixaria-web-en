import type { ImageData } from './types';

export interface AuditClientLogo {
  name: string;
  image: ImageData;
}

export const auditAssets = {
  // Previous clients supplied and approved by the user in public/logos.
  clientLogos: [
    { name: 'Massif', image: { src: '/logos/Artboard%201.jpg', alt: 'Massif', width: 900, height: 300 } },
    { name: 'Expo Mob', image: { src: '/logos/Artboard%202.jpg', alt: 'Expo Mob', width: 900, height: 300 } },
    { name: 'Agache', image: { src: '/logos/Artboard%203.jpg', alt: 'Agache', width: 900, height: 300 } },
    { name: 'Divanissimi', image: { src: '/logos/Artboard%204.jpg', alt: 'Divanissimi', width: 900, height: 300 } },
    { name: 'ABC Mobila', image: { src: '/logos/Artboard%205.jpg', alt: 'ABC Mobila', width: 900, height: 300 } },
    { name: 'Larix Mobila', image: { src: '/logos/Artboard%206.jpg', alt: 'Larix Mobila', width: 900, height: 300 } },
    { name: 'Sofa Mix', image: { src: '/logos/Artboard%207.jpg', alt: 'Sofa Mix', width: 900, height: 300 } },
    { name: 'Eurosun', image: { src: '/logos/Artboard%208.jpg', alt: 'Eurosun', width: 900, height: 300 } },
    { name: 'Artisanova', image: { src: '/logos/Artboard%209.jpg', alt: 'Artisanova', width: 900, height: 300 } },
    { name: 'Lockart Doors', image: { src: '/logos/Artboard%2010.jpg', alt: 'Lockart Doors', width: 900, height: 300 } },
    { name: 'Sofaest Mob', image: { src: '/logos/Artboard%2011.jpg', alt: 'Sofaest Mob', width: 900, height: 300 } },
    { name: 'Timflex', image: { src: '/logos/Artboard%2012.jpg', alt: 'Timflex', width: 900, height: 300 } },
  ] satisfies AuditClientLogo[],
  portraits: {
    Alex: '/people/Alex.jpg',
    Eduard: '/people/Eduard.jpg',
    Victor: '/SPO7558_Original.webp',
    Ovidiu: '/people/Ovi.jpg',
  },
  example: {
    // Only configure a genuine, approved audit PDF and a page/cover from that PDF.
    pdfUrl: null as string | null,
    downloadFilename: 'ixaria-example-audit.pdf',
    preview: null as ImageData | null,
  },
};
