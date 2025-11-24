

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  description: string;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

export interface Celebrity {
  name: string;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  handle?: string;
  category: string;
  notableInfo: string;
  logo: string;
  coverImage: string;
  followers: string;
  description: string;
  endorsedBy: Celebrity[];
  isNew?: boolean;
}

export interface Story {
  id: string;
  brandName: string;
  logo: string;
  image: string;
  isViewed: boolean;
}

export interface Occasion {
  id: string;
  title: string;
  image: string;
  textColor?: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  bgGradient: string;
  icon: string;
}

export interface Reel {
  id: string;
  videoUrl: string;
  product: Product;
  likes: string;
  user: string;
  userAvatar: string;
  brandId: string;
}

export interface TryOnResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  videoUrl?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  date: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
}

export interface UserProfile {
  name: string;
  phone: string;
  isLoggedIn: boolean;
  joinedDate: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
}
