
export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  createdAt: string;
}

export interface CustomField {
  id: string;
  key: string;
  value: string;
}

export interface CustomLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
  isPrivate: boolean;
  clicks: number;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
  custom: CustomLink[];
}

export type PrimaryCTA = 'save_contact' | 'visit_website' | 'book_call' | 'view_portfolio' | 'download_brochure';

export interface ThemeSettings {
  primaryColor: string;
  gradientFrom: string;
  gradientTo: string;
  fontFamily: 'Inter' | 'Outfit';
  style: 'glass' | 'solid' | 'minimal';
  buttonStyle: 'rounded' | 'pill' | 'square';
  qrStyle: 'dots' | 'squares' | 'rounded';
  qrColor: string;
  qrLogoEnabled: boolean;
  borderRadius: number;
  alignment: 'center' | 'left';
  spacing: 'compact' | 'relaxed';
  glassIntensity: number; // 0-100
  shadowDepth: number; // 0-100
  backgroundType: 'gradient' | 'image' | 'solid';
  backgroundImage?: string;
  bentoDensity: 'low' | 'high';
}

export interface CardAnalytics {
  date: string;
  views: number;
  clicks: number;
  scans: number;
}

export interface CardData {
  id: string;
  userId: string;
  usernameSlug: string;
  name: string;
  role: string;
  company: string;
  phone: string;
  isPhonePrivate: boolean;
  email: string;
  isEmailPrivate: boolean;
  website: string;
  address: string;
  bio: string;
  profileImage?: string;
  brandLogo?: string;
  primaryCTA: PrimaryCTA;
  customFields: CustomField[];
  socialLinks: SocialLinks;
  theme: ThemeSettings;
  views: number;
  clicks: number;
  scans: number;
  followers: number;
  mutuals: number;
  linkedinVelocity: number;
  retentionRate: number;
  analyticsHistory: CardAnalytics[];
  linkAnalytics: { [key: string]: number };
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}
