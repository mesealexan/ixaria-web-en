export interface PageSEO {
  path: string;
  title: string;
  description: string;
  robots: string;
  openGraph?: {
    type?: string;
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    imageWidth?: string;
    imageHeight?: string;
    locale?: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    image: string;
    imageAlt?: string;
  };
  alternates?: { language: string; href: string }[];
  lastModified?: string;
}

export type StructuredData = Record<string, unknown>;
