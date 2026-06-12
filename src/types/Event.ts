export type KovilEvent = {
  id: string;
  templeId: string;
  templeName: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'festival' | 'ritual' | 'procession' | 'other';
};