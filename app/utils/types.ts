export interface MenuItem {
  name: string;
  link?: string;
  submenus?: Category[];
}

export interface Newsletter {
  id: number;
  title: string;
  slug: string;
  url: string;
  featured_img: string;
  alt_text: string;
  publish_date: string;
}

export interface Event {
  id: number;
  featured_img: string;
  name: string;
  start_date: string;
  end_date: string;
  link: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Magazine {
  id: number;
  title: string;
  publish_date: string;
  cover_image: string;
  pdf: string;
  pdf_file?: string;
  content: string;
  page_title?: string;
  meta_keywords: string;
  meta_description: string;
  slug: string;
  category: {
    name: string;
    slug: string;
  }[];
  alt_text: string;
}

export interface Policy {
  id: number;
  meta_keywords: string[];
  policy_type: string;
  title: string;
  slug: string;
  content: string;
  is_active: boolean;
  last_updated: string; // ISO datetime string
  created_at: string; // ISO datetime string
  page_title: string | null;
  meta_description: string;
}

export interface ad {
  id: number;
  image: string;
  link: string;
}

export interface BaseItem {
  id: number | string;
  title: string;
  slug: string;
  publish_date: string;
  featured_img: string;
}

export interface GalleryImage {
  id: number;
  image: string;
  alt: string;
  title: string;
}

export interface GalleryItem extends BaseItem {
  date: string;
  page_title?: string;
  meta_keywords: string;
  meta_description: string;
  images: GalleryImage[];
}

export interface Plan {
  id: number;
  name: string;
  duration_type: 'yearly' | 'monthly' | 'quarterly';
  features: null | string[];
  duration_period: number;
  price: number;
  offer_price: number;
  currency: 'INR' | 'USD';
}

export interface Podcast {
  id: number;
  title: string;
  featured_img: string;
  slug: string;
  alt_text: string;
  audio_file: string;
  publish_date: string;
}

export interface apiItem {
  id: number;
  file: string;
  url: string;
}

export interface Interview {
  id: number;
  title: string;
  featured_img: string;
  slug: string;
  content: string;
  person_name: string;
  person_designation: string;
  audio_file: string;
  alt_text: string;
  publish_date: string;
  page_title?: string;
  meta_keywords: string;
  meta_description: string;
}

// export interface News extends Interview {
//   category: Category[];
// }

export interface News extends Interview {
  category?: Category[];
  categories?: { name: string; slug: string }[];
}

export interface video {
  id: number;
  title: string;
  slug: string;
  thumbnail_image: string;
  alt_text: string;
  video_url: string;
  publish_date: string;
}

export interface Tab {
  id: number;
  title: string;
  item: (Podcast | Interview | GalleryItem)[];
}
export interface Question {
  id: number;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number';
  question: string;
  required: boolean;
  options?: string | null;
  placeholder?: string;
  maxLength?: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minValue?: number;
    maxValue?: number;
  };
}

export interface ContactInfo {
  id: number;
  email: string;
  phone: string;
  address: string; // Contains HTML content
  map_url: string;
  is_active: boolean;
}

export interface HomeApiData {
  categories: Category[];
  latest_news: News[];
  advertisements: ad[];
  upcoming_events: Event[];
  tabsData: Tab[];
}
