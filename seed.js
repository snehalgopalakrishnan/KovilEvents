const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAl_Sci94uBxXYA7O1Dy7_ywwBshLNvLqk",
  authDomain: "kovilevents.firebaseapp.com",
  projectId: "kovilevents",
  storageBucket: "kovilevents.firebasestorage.app",
  messagingSenderId: "1032943476348",
  appId: "1:1032943476348:web:d12a8a2571f21cfcc4f3f9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const temples = [
  {
    name: 'Kalpathy Viswanathar Temple',
    location: 'Kalpathy, Palakkad',
    description: 'One of the oldest temples in Palakkad, famous for the annual Kalpathy Ratholsavam chariot festival.',
    imageUrl: '',
  },
  {
    name: 'Hemambika Devi Temple',
    location: 'Palakkad Fort',
    description: 'Located near the Palakkad fort, this temple is dedicated to Goddess Hemambika.',
    imageUrl: '',
  },
  {
    name: 'Thenambikavil Bhagavathy Temple',
    location: 'Palakkad Town',
    description: 'A prominent Bhagavathy temple in the heart of Palakkad town.',
    imageUrl: '',
  },
  {
    name: 'Malampuzha Devi Temple',
    location: 'Malampuzha',
    description: 'Situated near the scenic Malampuzha dam and gardens.',
    imageUrl: '',
  },
];

const events = [
  {
    templeName: 'Kalpathy Viswanathar Temple',
    title: 'Thiruvathira Nritham',
    description: 'Traditional dance performance by temple artists on the occasion of Thiruvathira.',
    date: '2026-06-14',
    time: '6:00 PM',
    type: 'festival',
  },
  {
    templeName: 'Hemambika Devi Temple',
    title: 'Pradosha Pooja',
    description: 'Special pooja conducted on Pradosha day dedicated to Lord Shiva.',
    date: '2026-06-16',
    time: '5:30 PM',
    type: 'ritual',
  },
  {
    templeName: 'Thenambikavil Bhagavathy Temple',
    title: 'Aarattu Procession',
    description: 'Annual procession where the deity is taken in a grand procession through the streets.',
    date: '2026-06-22',
    time: '7:00 AM',
    type: 'procession',
  },
  {
    templeName: 'Kalpathy Viswanathar Temple',
    title: 'Kalpathy Ratholsavam',
    description: 'The grand annual chariot festival — one of the most celebrated events in Palakkad.',
    date: '2026-06-30',
    time: '4:00 PM',
    type: 'festival',
  },
  {
    templeName: 'Malampuzha Devi Temple',
    title: 'Navratri Celebrations',
    description: 'Nine days of special poojas and cultural programmes during Navratri.',
    date: '2026-07-05',
    time: '8:00 AM',
    type: 'festival',
  },
];

async function seed() {
  console.log('Seeding temples...');
  
  const templeIds = {};
  
  for (const temple of temples) {
    const ref = await addDoc(collection(db, 'temples'), temple);
    templeIds[temple.name] = ref.id;
    console.log(`Added temple: ${temple.name} (${ref.id})`);
  }

  console.log('\nSeeding events...');

  for (const event of events) {
    const templeId = templeIds[event.templeName];
    await addDoc(collection(db, 'events'), {
      ...event,
      templeId,
    });
    console.log(`Added event: ${event.title}`);
  }

  console.log('\nDone! Database seeded successfully.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error seeding:', err);
  process.exit(1);
});