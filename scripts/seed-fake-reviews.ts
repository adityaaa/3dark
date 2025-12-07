// scripts/seed-fake-reviews.ts
// Run with: npx ts-node scripts/seed-fake-reviews.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Realistic Indian customer names
const CUSTOMER_NAMES = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Singh', 'Rahul Verma',
  'Ananya Reddy', 'Vikram Mehta', 'Kavya Iyer', 'Arjun Nair', 'Pooja Gupta',
  'Karan Malhotra', 'Nisha Kapoor', 'Siddharth Joshi', 'Riya Desai', 'Aditya Rao',
  'Meera Pillai', 'Rohan Kulkarni', 'Shreya Menon', 'Varun Agarwal', 'Diya Shetty'
];

// Review templates for different ratings
const REVIEW_TEMPLATES = {
  5: [
    {
      title: 'Absolutely love it!',
      comments: [
        'Amazing quality! The print is vibrant and the fabric is super comfortable. Totally worth the price!',
        'Best purchase ever! The glow effect is stunning and it fits perfectly. Highly recommend!',
        'Outstanding product! Loved the quality and the design. Will definitely buy more!',
        'Excellent! The material is soft, breathable and the glow-in-the-dark effect is amazing!',
        'Perfect! Great quality, fast delivery, and the design looks even better in person!'
      ]
    },
    {
      title: 'Exceeded expectations!',
      comments: [
        'The quality is top-notch! Fabric feels premium and the print is crystal clear.',
        'Super comfortable and stylish! The glow effect works really well. Very satisfied!',
        'Really impressed with the quality. The fit is perfect and it looks great!',
        'Awesome product! The design is unique and the quality is fantastic!',
        'Highly satisfied! Great fabric, perfect fit, and the glow effect is mind-blowing!'
      ]
    },
    {
      title: 'Must buy!',
      comments: [
        'This is my favorite piece now! Comfortable, stylish, and unique design.',
        'Perfect for night rides! The glow effect is strong and looks amazing.',
        'Great quality and fast shipping! The product exceeded my expectations.',
        'Love the design and comfort! Will definitely order more products.',
        'Fantastic purchase! The quality is premium and it looks stunning!'
      ]
    }
  ],
  4: [
    {
      title: 'Good quality!',
      comments: [
        'Really good product! The print is nice and fabric quality is decent. Slight color difference from image.',
        'Good purchase overall. Comfortable and the glow effect works well. Worth the money!',
        'Nice quality! Fits well and looks good. The glow could be slightly brighter.',
        'Pretty good! Quality is decent and design is unique. Happy with purchase.',
        'Good product! The fabric is comfortable and print quality is nice.'
      ]
    },
    {
      title: 'Worth it!',
      comments: [
        'Good quality overall. The fit is slightly loose but the design is great!',
        'Nice product! The glow effect is good but could last longer. Still satisfied.',
        'Pretty satisfied with the quality. The print is vibrant and fabric is soft.',
        'Good value for money! Quality is decent and delivery was quick.',
        'Decent product! The design is unique and quality is acceptable.'
      ]
    }
  ],
  3: [
    {
      title: 'Average product',
      comments: [
        'Okay product. Quality is average but the design is nice. Could be better.',
        'Decent for the price. The glow effect is there but not very strong.',
        'Average quality. The print is okay but the fit could be better.',
        'It\'s alright. Nothing special but serves the purpose.'
      ]
    }
  ]
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
}

async function seedReviews() {
  console.log('🌱 Starting to seed fake reviews...\n');

  try {
    // Get all products
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products\n`);

    let totalReviews = 0;

    for (const product of products) {
      // Random number of reviews per product (3-8)
      const numReviews = Math.floor(Math.random() * 6) + 3;
      
      console.log(`Adding ${numReviews} reviews for: ${product.name}`);

      for (let i = 0; i < numReviews; i++) {
        // Weight ratings towards 4 and 5 stars (80% positive)
        const random = Math.random();
        let rating: 5 | 4 | 3;
        if (random < 0.5) rating = 5;      // 50% - 5 stars
        else if (random < 0.85) rating = 4; // 35% - 4 stars
        else rating = 3;                    // 15% - 3 stars

        const templates = REVIEW_TEMPLATES[rating];
        const template = getRandomElement(templates);
        const comment = getRandomElement(template.comments);
        const customerName = getRandomElement(CUSTOMER_NAMES);

        await prisma.review.create({
          data: {
            productId: product.id,
            rating,
            title: template.title,
            comment,
            customerName,
            isFake: true,
            isVerified: false,
            createdAt: getRandomDate(60), // Reviews from last 60 days
          }
        });

        totalReviews++;
      }
    }

    console.log(`\n✅ Successfully seeded ${totalReviews} fake reviews!`);
    console.log(`📊 Average: ${(totalReviews / products.length).toFixed(1)} reviews per product\n`);

  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedReviews()
  .catch(console.error);
