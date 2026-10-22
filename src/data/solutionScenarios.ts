export const solutionProduct = {
  name: 'Valencia Sofa',
  price: '€2,350',
  description: '2-seater couch with storage and sleeping option',
  rating: '4.9',
  reviewCount: 128,
  image: {
    src: '/before-836.webp',
    alt: 'Valencia Sofa in beige upholstery',
    width: 836,
    height: 470,
  },
} as const;

export const solutionThumbnails = [
  { name: 'Sofa overview', crop: { x: 0, y: 78, width: 522, height: 391.5 } },
  { name: 'Cushion detail', crop: { x: 62, y: 165, width: 240, height: 180 } },
  { name: 'Seat detail', crop: { x: 210, y: 220, width: 280, height: 210 } },
  { name: 'Upholstery detail', crop: { x: 15, y: 215, width: 124, height: 93 } },
] as const;

export const solutionColors = [
  { id: 'sand', name: 'Sand', hex: '#c9bea9', image: '/before-836.webp' },
  { id: 'ivory', name: 'Ivory', hex: '#e3dcca', image: '/sofa-colors/ivory.webp' },
  { id: 'warm-grey', name: 'Warm Grey', hex: '#a7a39d', image: '/sofa-colors/warm-grey.webp' },
  { id: 'charcoal', name: 'Charcoal', hex: '#66686a', image: '/sofa-colors/charcoal.webp' },
  { id: 'sage', name: 'Sage', hex: '#8f9b83', image: '/sofa-colors/sage.webp' },
  { id: 'navy', name: 'Navy', hex: '#46576e', image: '/sofa-colors/navy.webp' },
  { id: 'terracotta', name: 'Terracotta', hex: '#b77c68', image: '/sofa-colors/terracotta.webp' },
  { id: 'ochre', name: 'Ochre', hex: '#b69a56', image: '/sofa-colors/ochre.webp' },
] as const;

export const solutionScenarios = [
  { id: 'returns', label: 'Returns', question: 'What happens if I want to return it?' },
  { id: 'color', label: 'Color', question: 'Will the color match my room?' },
  { id: 'material', label: 'Material', question: 'Will it withstand my children and pets?' },
  { id: 'price', label: 'Price', question: 'Is it worth the price?' },
  { id: 'showroom-visit', label: 'Showroom Visit', question: 'Can I see it before I buy it?' },
] as const;
