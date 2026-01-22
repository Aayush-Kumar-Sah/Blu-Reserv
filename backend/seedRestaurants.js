require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const connectDB = require('./config/db');

// Food court shared seating capacity
const FOOD_COURT_SEATS = 100;

const restaurants = [
  {
    name: 'The Italian Corner',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '11:00',
    closingTime: '22:00',
    slotDuration: 60,
    description: 'Authentic Italian cuisine with fresh pasta, wood-fired pizzas, and traditional desserts.',
    image: '/images/italian.jpg',
    cuisine: 'Italian'
  },
  {
    name: 'Spice Garden',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '10:00',
    closingTime: '21:00',
    slotDuration: 60,
    description: 'Experience the rich flavors of Indian spices with our authentic curries and tandoori specialties.',
    image: '/images/indian.jpg',
    cuisine: 'Indian'
  },
  {
    name: 'Sushi Master',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '12:00',
    closingTime: '22:00',
    slotDuration: 60,
    description: 'Fresh sushi, sashimi, and Japanese delicacies prepared by expert chefs.',
    image: '/images/japanese.jpg',
    cuisine: 'Japanese'
  },
  {
    name: 'The Grill House',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '11:00',
    closingTime: '22:00',
    slotDuration: 60,
    description: 'Premium steaks, burgers, and grilled specialties in a cozy atmosphere.',
    image: '/images/grill.jpg',
    cuisine: 'American'
  },
  {
    name: 'Dragon Wok',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '11:00',
    closingTime: '22:00',
    slotDuration: 60,
    description: 'Authentic Chinese cuisine with dim sum, stir-fries, and traditional Cantonese dishes.',
    image: '/images/chinese.jpg',
    cuisine: 'Chinese'
  },
  {
    name: 'Taco Fiesta',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '10:00',
    closingTime: '22:00',
    slotDuration: 60,
    description: 'Vibrant Mexican flavors with tacos, burritos, quesadillas, and fresh guacamole.',
    image: '/images/mexican.jpg',
    cuisine: 'Mexican'
  },
  {
    name: 'Mediterranean Breeze',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '11:00',
    closingTime: '22:00',
    slotDuration: 60,
    description: 'Fresh Mediterranean cuisine with falafel, hummus, grilled meats, and Greek specialties.',
    image: '/images/mediterranean.jpg',
    cuisine: 'Mediterranean'
  },
  {
    name: 'Thai Orchid',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '11:00',
    closingTime: '22:00',
    slotDuration: 60,
    description: 'Aromatic Thai dishes with pad thai, curries, and traditional street food favorites.',
    image: '/images/thai.jpg',
    cuisine: 'Thai'
  },
  {
    name: 'Bistro Français',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '11:00',
    closingTime: '23:00',
    slotDuration: 60,
    description: 'Classic French cuisine with croissants, crepes, coq au vin, and fine pastries.',
    image: '/images/french.jpg',
    cuisine: 'French'
  },
  {
    name: 'Seoul Kitchen',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '11:00',
    closingTime: '22:00',
    slotDuration: 60,
    description: 'Korean BBQ, bibimbap, kimchi, and other authentic Korean delicacies.',
    image: '/images/korean.jpg',
    cuisine: 'Korean'
  },
  {
    name: 'Healthy Bites',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '10:00',
    closingTime: '20:00',
    slotDuration: 60,
    description: 'Fresh salads, smoothie bowls, wraps, and nutritious meals for health-conscious diners.',
    image: '/images/healthy.jpg',
    cuisine: 'Healthy'
  },
  {
    name: 'Pizza Paradise',
    totalSeats: FOOD_COURT_SEATS,
    openingTime: '11:00',
    closingTime: '23:00',
    slotDuration: 60,
    description: 'Wood-fired pizzas with creative toppings, calzones, and Italian appetizers.',
    image: '/images/pizza.jpg',
    cuisine: 'Pizza'
  }
];

const seedRestaurants = async () => {
  try {
    await connectDB();

    // Clear existing restaurants
    await Restaurant.deleteMany({});
    console.log('Cleared existing restaurants');

    // Insert new restaurants
    await Restaurant.insertMany(restaurants);
    console.log(`Successfully seeded ${restaurants.length} restaurants`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding restaurants:', error);
    process.exit(1);
  }
};

seedRestaurants();
