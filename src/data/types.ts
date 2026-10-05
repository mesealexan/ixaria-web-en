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
  linkedin: string;
  image: ImageData;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string[];
}
