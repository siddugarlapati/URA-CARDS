import { User, CardData, ThemeSettings, SocialLinks, CardAnalytics } from '../types';
import { DEFAULT_THEME, MOCK_API_DELAY } from '../constants';

const USERS_KEY = 'ura_users';
const CARDS_KEY = 'ura_cards';
const AUTH_KEY = 'ura_auth';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth
  async signup(name: string, email: string, password: string): Promise<User> {
    await delay(MOCK_API_DELAY);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u: any) => u.email === email)) throw new Error('User already exists');
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      createdAt: new Date().toISOString()
    };
    users.push({ ...newUser, password }); 
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async login(email: string, password: string): Promise<User> {
    await delay(MOCK_API_DELAY);
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    const { password: _, ...userSafe } = user;
    localStorage.setItem(AUTH_KEY, JSON.stringify(userSafe));
    return userSafe;
  },

  async getCurrentUser(): Promise<User | null> {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  // Cards
  async getUserCards(): Promise<CardData[]> {
    await delay(MOCK_API_DELAY);
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    const allCards = JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
    return allCards.filter((c: CardData) => c.userId === user.id);
  },

  async getCardById(id: string): Promise<CardData> {
    await delay(MOCK_API_DELAY);
    const allCards = JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
    const card = allCards.find((c: CardData) => c.id === id);
    if (!card) throw new Error('Card not found');
    return card;
  },

  // Fix: Added missing method getCardByUsername for PublicCardPage to resolve the search error.
  async getCardByUsername(username: string): Promise<CardData> {
    await delay(MOCK_API_DELAY);
    const allCards = JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
    const card = allCards.find((c: CardData) => c.usernameSlug === username);
    if (!card) throw new Error('Card not found');
    return card;
  },

  async saveCard(card: Partial<CardData>): Promise<CardData> {
    await delay(MOCK_API_DELAY);
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const allCards = JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
    if (card.id) {
      const index = allCards.findIndex((c: CardData) => c.id === card.id);
      if (index === -1) throw new Error('Card not found');
      const updatedCard = { ...allCards[index], ...card, updatedAt: new Date().toISOString() };
      allCards[index] = updatedCard;
      localStorage.setItem(CARDS_KEY, JSON.stringify(allCards));
      return updatedCard;
    } else {
      const newCard: CardData = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        usernameSlug: (card.name || 'user').toLowerCase().replace(/\s+/g, '-'),
        name: card.name || '',
        role: card.role || '',
        company: card.company || '',
        phone: card.phone || '',
        isPhonePrivate: card.isPhonePrivate ?? true,
        isEmailPrivate: card.isEmailPrivate ?? true,
        isPrivate: card.isPrivate ?? false,
        email: card.email || user.email,
        website: card.website || '',
        address: card.address || '',
        bio: card.bio || '',
        // FIX: Added missing primaryCTA to satisfy CardData interface
        primaryCTA: card.primaryCTA || 'save_contact',
        customFields: card.customFields || [
           { id: '1', key: 'College / University', value: '' },
           { id: '2', key: 'Office / Organization', value: '' }
        ],
        socialLinks: (card.socialLinks as SocialLinks) || { custom: [] },
        theme: card.theme || DEFAULT_THEME,
        views: 1240,
        clicks: 850,
        scans: 420,
        followers: 180,
        mutuals: 45,
        linkedinVelocity: 14.2,
        retentionRate: 72,
        analyticsHistory: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 50 + 20),
          clicks: Math.floor(Math.random() * 20 + 5),
          scans: Math.floor(Math.random() * 10 + 2)
        })),
        linkAnalytics: {
           linkedin: 450,
           github: 230,
           website: 120,
           instagram: 50
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileImage: card.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
      };
      allCards.push(newCard);
      localStorage.setItem(CARDS_KEY, JSON.stringify(allCards));
      return newCard;
    }
  },

  async deleteCard(id: string): Promise<void> {
    await delay(MOCK_API_DELAY);
    const allCards = JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
    localStorage.setItem(CARDS_KEY, JSON.stringify(allCards.filter((c: CardData) => c.id !== id)));
  }
};