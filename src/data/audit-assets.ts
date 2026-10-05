import type { ImageData } from './types';

export interface AuditClientLogo {
  name: string;
  image: ImageData;
}

export const auditAssets = {
  // These relationships were confirmed in the supplied sales brief.
  // Team members' employers are not Ixaria client logos.
  // The supplied Agache WebP is fully transparent; omit it until a usable logo is supplied.
  clientLogos: [
    {
      name: 'Sofa Mix',
      image: { src: '/logo_sofamix.avif', alt: 'Sofa Mix', width: 400, height: 133 },
    },
    {
      name: 'Expo Mob',
      image: { src: '/logo_expomob.webp', alt: 'Expo Mob', width: 240, height: 40 },
    },
  ] satisfies AuditClientLogo[],
  portraits: {
    Alex: '/image_jvvk-gwA_1753779138285_raw.webp',
    Eduard: '/eduard-badea.webp',
    Victor: '/SPO7558_Original.webp',
    Ovidiu: null as string | null,
  },
  example: {
    // Only configure a genuine, approved audit PDF and a page/cover from that PDF.
    pdfUrl: null as string | null,
    downloadFilename: 'ixaria-example-audit.pdf',
    preview: null as ImageData | null,
  },
};
