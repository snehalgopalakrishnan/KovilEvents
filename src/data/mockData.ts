import { Temple } from '../types/Temple';
import { KovilEvent } from '../types/Event';

export const TEMPLES: Temple[] = [
  {
    id: 't1',
    name: 'Kalpathy Viswanathar Temple',
    location: 'Kalpathy, Palakkad',
    description: 'One of the oldest temples in Palakkad, famous for the annual Kalpathy Ratholsavam chariot festival.',
    imageUrl: '',
  },
  {
    id: 't2',
    name: 'Hemambika Devi Temple',
    location: 'Palakkad Fort',
    description: 'Located near the Palakkad fort, this temple is dedicated to Goddess Hemambika.',
    imageUrl: '',
  },
  {
    id: 't3',
    name: 'Thenambikavil Bhagavathy Temple',
    location: 'Palakkad Town',
    description: 'A prominent Bhagavathy temple in the heart of Palakkad town.',
    imageUrl: '',
  },
  {
    id: 't4',
    name: 'Malampuzha Devi Temple',
    location: 'Malampuzha',
    description: 'Situated near the scenic Malampuzha dam and gardens.',
    imageUrl: '',
  },
];

export const EVENTS: KovilEvent[] = [
  {
    id: 'e1',
    templeId: 't1',
    templeName: 'Kalpathy Viswanathar Temple',
    title: 'Thiruvathira Nritham',
    description: 'Traditional dance performance by temple artists on the occasion of Thiruvathira.',
    date: '2026-06-14',
    time: '6:00 PM',
    type: 'festival',
  },
  {
    id: 'e2',
    templeId: 't2',
    templeName: 'Hemambika Devi Temple',
    title: 'Pradosha Pooja',
    description: 'Special pooja conducted on Pradosha day dedicated to Lord Shiva.',
    date: '2026-06-16',
    time: '5:30 PM',
    type: 'ritual',
  },
  {
    id: 'e3',
    templeId: 't3',
    templeName: 'Thenambikavil Bhagavathy Temple',
    title: 'Aarattu Procession',
    description: 'Annual procession where the deity is taken in a grand procession through the streets.',
    date: '2026-06-22',
    time: '7:00 AM',
    type: 'procession',
  },
  {
    id: 'e4',
    templeId: 't1',
    templeName: 'Kalpathy Viswanathar Temple',
    title: 'Kalpathy Ratholsavam',
    description: 'The grand annual chariot festival — one of the most celebrated events in Palakkad.',
    date: '2026-06-30',
    time: '4:00 PM',
    type: 'festival',
  },
  {
    id: 'e5',
    templeId: 't4',
    templeName: 'Malampuzha Devi Temple',
    title: 'Navratri Celebrations',
    description: 'Nine days of special poojas and cultural programmes during Navratri.',
    date: '2026-07-05',
    time: '8:00 AM',
    type: 'festival',
  },
];