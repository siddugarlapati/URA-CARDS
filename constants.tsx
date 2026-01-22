
import { ThemeSettings } from './types';

// Strict Institutional Palette: 
// Gold (#f59e0b), Emerald (#10b981), Navy (#020617), Cream (#fdfcf0).
export const DEFAULT_THEME: ThemeSettings = {
  primaryColor: '#020617', // Navy
  gradientFrom: '#ffffff',
  gradientTo: '#fdfcf0', // Cream
  fontFamily: 'Outfit',
  style: 'glass',
  buttonStyle: 'pill',
  qrStyle: 'rounded',
  qrColor: '#020617',
  qrLogoEnabled: true,
  borderRadius: 40,
  alignment: 'center',
  spacing: 'relaxed',
  glassIntensity: 40,
  shadowDepth: 20,
  backgroundType: 'gradient',
  bentoDensity: 'high',
};

export const GRADIENT_PRESETS = [
  { name: 'Obsidian Navy', from: '#020617', to: '#0f172a' },
  { name: 'Elite Gold', from: '#fdfcf0', to: '#fef3c7' },
  { name: 'Emerald Peak', from: '#f0fdf4', to: '#dcfce7' },
  { name: 'Institutional White', from: '#ffffff', to: '#f8fafc' },
  { name: 'Executive Cream', from: '#fafaf9', to: '#f5f5f4' },
];

export const AVATAR_COLLECTION = {
  boys: [
    { id: 'b1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&top=shortHair&clothes=blazerAndShirt&mouth=smile&eyebrows=default&eyes=default' },
    { id: 'b2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&top=shortHair&accessories=round&clothes=blazerAndShirt&mouth=smile' },
    { id: 'b3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adrian&top=bob&hairColor=2c1b18&clothes=blazerAndShirt&mouth=smile' },
    { id: 'b4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&top=shaggy&clothes=blazerAndShirt&accessories=prescription02&mouth=smile' },
  ],
  girls: [
    { id: 'g1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&top=longHair&hairColor=2c1b18&clothes=blazerAndShirt&mouth=smile' },
    { id: 'g2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&top=bob&accessories=prescription02&clothes=blazerAndShirt&mouth=smile' },
    { id: 'g3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Claire&top=curvy&hairColor=a55728&clothes=blazerAndShirt&mouth=smile' },
    { id: 'g4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella&top=longHair&hairColor=4a312c&clothes=blazerAndShirt&accessories=round&mouth=smile' },
  ]
};

export const MOCK_API_DELAY = 400;
