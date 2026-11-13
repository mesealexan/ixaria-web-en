export interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ContentCard {
  title: string;
  body: string;
  image: ImageData;
}

export interface Founder {
  name: string;
  role: string;
  description: string;
  linkedin: string;
  image: ImageData;
  imagePosition?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string[];
}
