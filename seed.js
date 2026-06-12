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
    name: 'Sri Simhanadha Bhagavathi Temple',
    location: 'Tharekkad, Vinayaka Colony, Palakkad',
    description: 'One of the oldest temples in Palakkad town. Bhagavathy is the kaval devatha for 18 agraharams. Famous annual festival in December-January.',
    imageUrl: '',
    phone: '',
    timing: '5:30 AM – 8:00 PM',
    latitude: 10.7804268,
    longitude: 76.6549338,
    whatsappLink: '',
  },
  {
    name: 'Sree Chinmaya Guruvayurappan Temple',
    location: 'Malampuzha 100 Feet Rd, Tharekkad, Palakkad',
    description: 'A spiritual hub of Palakkad near Government Victoria College. Dedicated to Lord Guruvayoorappan. Festivals like Vishu and Ashtami Rohini celebrated grandly.',
    imageUrl: '',
    phone: '+91 491 252 7366',
    timing: '5:00 – 10:30 AM, 5:00 – 8:00 PM',
    latitude: 10.7844041,
    longitude: 76.6535289,
    whatsappLink: '',
  },
  {
    name: 'Sree Vishalakshi Samathe Vishwanatha Temple',
    location: 'Shivan Kovil Street, Tharekkad, Palakkad',
    description: 'Ancient 600-year-old Shiva temple in Tharekkad established by Tamil Brahmin settlers. Dedicated to Lord Shiva and Goddess Parvathi.',
    imageUrl: '',
    phone: '+91 95443 41666',
    timing: '5:00 AM – 7:30 PM',
    latitude: 10.783469,
    longitude: 76.656429,
    whatsappLink: '',
  },
  {
    name: 'Shri Vishweshwara Temple',
    location: 'Tippusulthan Nagar, West Yakkara, Palakkad',
    description: 'Historic Shiva temple built on the orders of Sree Narayana Guru in the early 1900s. Famous for marriages and cultural events.',
    imageUrl: '',
    phone: '+91 94969 57317',
    timing: '5:00 AM – 8:00 PM',
    latitude: 10.7555915,
    longitude: 76.6481794,
    whatsappLink: '',
  },
];

const events = [
  {
    templeName: 'Sri Simhanadha Bhagavathi Temple',
    title: 'Annual Festival',
    description: 'Grand annual festival celebrating Bhagavathy with special poojas and cultural programmes.',
    date: '2026-07-14',
    time: '6:00 PM',
    type: 'festival',
  },
  {
    templeName: 'Sree Chinmaya Guruvayurappan Temple',
    title: 'Ashtami Rohini Celebration',
    description: 'Special celebration of Ashtami Rohini — the birthday of Lord Krishna.',
    date: '2026-07-16',
    time: '5:00 AM',
    type: 'festival',
  },
  {
    templeName: 'Sree Vishalakshi Samathe Vishwanatha Temple',
    title: 'Pradosha Pooja',
    description: 'Special pooja conducted on Pradosha day dedicated to Lord Shiva.',
    date: '2026-07-22',
    time: '6:00 PM',
    type: 'ritual',
  },
  {
    templeName: 'Shri Vishweshwara Temple',
    title: 'Vishu Celebrations',
    description: 'Grand Vishu celebrations with special poojas and cultural programmes.',
    date: '2026-07-30',
    time: '5:00 AM',
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