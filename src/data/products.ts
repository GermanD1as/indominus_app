export type Category = 'shirts' | 'hoodies' | 'jackets';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: Category;
  description: string;
  colorways: string[];
  sizes: string[];
  unityAssetId: string;
  imageUrl: string;
  tags: string[];
  rating: number;
  reviewCount: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'shirt-001',
    name: 'Apex Tech Tee',
    brand: 'Vexlar',
    price: 49,
    category: 'shirts',
    description:
      'Ultra-lightweight performance fabric engineered for movement. Anti-microbial, moisture-wicking weave keeps you cool under pressure.',
    colorways: ['#1A1A2E', '#7C6FED', '#4ECDC4'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    unityAssetId: 'garment_shirt_apex_tech',
    imageUrl: '',
    tags: ['performance', 'tech', 'slim-fit'],
    rating: 4.7,
    reviewCount: 284,
  },
  {
    id: 'shirt-002',
    name: 'Phantom Mesh Shirt',
    brand: 'Kryos',
    price: 65,
    category: 'shirts',
    description:
      'Open-knit mesh construction with reflective thread accents. Breathable panels at the shoulders and sides for ventilation.',
    colorways: ['#0D0D1A', '#2D2D45', '#F0F0FF'],
    sizes: ['S', 'M', 'L', 'XL'],
    unityAssetId: 'garment_shirt_phantom_mesh',
    imageUrl: '',
    tags: ['mesh', 'reflective', 'breathable'],
    rating: 4.5,
    reviewCount: 147,
  },
  {
    id: 'shirt-003',
    name: 'Orbital Longline Tee',
    brand: 'Vexlar',
    price: 58,
    category: 'shirts',
    description:
      'Extended hem silhouette with tonal graphic print. Heavyweight 320gsm cotton with a barely-there soft-wash finish.',
    colorways: ['#13131F', '#3D1A78', '#8B4513'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    unityAssetId: 'garment_shirt_orbital_longline',
    imageUrl: '',
    tags: ['longline', 'graphic', 'heavyweight'],
    rating: 4.8,
    reviewCount: 392,
  },
  {
    id: 'hoodie-001',
    name: 'Nexus Oversized Hoodie',
    brand: 'Aethr',
    price: 119,
    category: 'hoodies',
    description:
      'Dropped-shoulder silhouette with kangaroo pocket and ribbed cuffs. Brushed fleece interior for warmth without bulk.',
    colorways: ['#0C0C14', '#7C6FED', '#1E3A2F'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    unityAssetId: 'garment_hoodie_nexus_oversized',
    imageUrl: '',
    tags: ['oversized', 'fleece', 'streetwear'],
    rating: 4.9,
    reviewCount: 531,
  },
  {
    id: 'hoodie-002',
    name: 'Cryogen Zip Hoodie',
    brand: 'Kryos',
    price: 138,
    category: 'hoodies',
    description:
      'Half-zip construction with contrast zipper tape. Thermal-bonded seams and a sculpted hood with no drawstrings.',
    colorways: ['#1C1C2E', '#2E4A6F', '#4A2E6F'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    unityAssetId: 'garment_hoodie_cryogen_zip',
    imageUrl: '',
    tags: ['half-zip', 'thermal', 'minimal'],
    rating: 4.6,
    reviewCount: 218,
  },
  {
    id: 'hoodie-003',
    name: 'Void Pullover',
    brand: 'Aethr',
    price: 99,
    category: 'hoodies',
    description:
      'Clean pullover with tonal embroidered branding. Double-faced jersey with waffle-weave interior texture.',
    colorways: ['#080810', '#1A1A30', '#4A2E10'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    unityAssetId: 'garment_hoodie_void_pullover',
    imageUrl: '',
    tags: ['minimal', 'embroidered', 'waffle'],
    rating: 4.7,
    reviewCount: 309,
  },
  {
    id: 'jacket-001',
    name: 'Spectra Bomber',
    brand: 'Nullform',
    price: 249,
    category: 'jackets',
    description:
      'Iridescent ripstop shell with a satin lining. Ribbed collar, cuffs, and hem. Concealed snap pockets at the chest.',
    colorways: ['#1A1A2E', '#2E1A3A', '#1A2E2E'],
    sizes: ['S', 'M', 'L', 'XL'],
    unityAssetId: 'garment_jacket_spectra_bomber',
    imageUrl: '',
    tags: ['bomber', 'iridescent', 'satin'],
    rating: 4.8,
    reviewCount: 176,
  },
  {
    id: 'jacket-002',
    name: 'Kinetic Shell Jacket',
    brand: 'Vexlar',
    price: 318,
    category: 'jackets',
    description:
      'Three-layer waterproof-breathable membrane with articulated patterning for unrestricted movement. Fully taped seams.',
    colorways: ['#0C1A2E', '#0C2E1A', '#2E0C0C'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    unityAssetId: 'garment_jacket_kinetic_shell',
    imageUrl: '',
    tags: ['waterproof', 'shell', 'technical'],
    rating: 4.9,
    reviewCount: 423,
  },
  {
    id: 'jacket-003',
    name: 'Fracture Puffer',
    brand: 'Nullform',
    price: 279,
    category: 'jackets',
    description:
      'Geometric quilt pattern with recycled 700-fill down. Packable into its own chest pocket. Matte nylon exterior.',
    colorways: ['#0D0D0D', '#1A1A1A', '#0D1A2E'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    unityAssetId: 'garment_jacket_fracture_puffer',
    imageUrl: '',
    tags: ['puffer', 'down', 'packable', 'geometric'],
    rating: 4.7,
    reviewCount: 267,
  },
];

export const CATEGORIES: Array<{ key: 'all' | Category; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'shirts', label: 'Shirts' },
  { key: 'hoodies', label: 'Hoodies' },
  { key: 'jackets', label: 'Jackets' },
];
