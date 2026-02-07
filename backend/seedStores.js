require("dotenv").config();

const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const User = require("./models/User");
const Store = require("./models/Store");

const STORES = [
  {
    name: "Blue Leaf Mart",
    email: "blueleafmart@gmail.com",
    address: "23 Green Avenue, Banjara Hills, Hyderabad",
    ownerName: "Rahul Verma",
    rating: 4.3,
    description:
      "A neighborhood store offering daily essentials and organic products. Known for friendly service and quality groceries.",
  },
  {
    name: "Urban Crate Store",
    email: "urbancrate.store@gmail.com",
    address: "118 Park Street, Indiranagar, Bengaluru",
    ownerName: "Ananya Rao",
    rating: 4.6,
    description:
      "A modern retail outlet focusing on lifestyle and home essentials. Popular for trendy products and neat store layout.",
  },
  {
    name: "FreshWay Grocers",
    email: "freshwaygrocers@gmail.com",
    address: "45 Lake View Road, Alwarpet, Chennai",
    ownerName: "Suresh Kumar",
    rating: 4.1,
    description:
      "Specializes in fresh vegetables, fruits, and dairy products. Maintains high hygiene standards and fair pricing.",
  },
  {
    name: "DailyNest Shop",
    email: "dailynest.shop@gmail.com",
    address: "9 Sunrise Colony, Aundh, Pune",
    ownerName: "Neha Joshi",
    rating: 4.0,
    description:
      "A compact store for everyday household needs. Convenient location with quick checkout experience.",
  },
  {
    name: "Cornerstone Supplies",
    email: "cornerstone.supplies@gmail.com",
    address: "302 MG Road, Kochi",
    ownerName: "Thomas Mathew",
    rating: 4.4,
    description:
      "Provides quality household and cleaning supplies. Trusted by local residents for consistency and reliability.",
  },
  {
    name: "Happy Basket",
    email: "happybasket.shop@gmail.com",
    address: "77 Rose Garden Lane, Salt Lake, Kolkata",
    ownerName: "Priya Sen",
    rating: 4.5,
    description:
      "A cheerful grocery store with a wide product range. Known for fresh stock and polite staff.",
  },
  {
    name: "PrimePick Store",
    email: "primepick.store@gmail.com",
    address: "14 Sector 18, Noida",
    ownerName: "Aman Khurana",
    rating: 4.2,
    description:
      "Offers premium groceries and imported food items. Ideal for customers looking for quality brands.",
  },
  {
    name: "GreenCart Hub",
    email: "greencart.hub@gmail.com",
    address: "56 Eco Street, Vashi, Navi Mumbai",
    ownerName: "Kunal Mehta",
    rating: 4.7,
    description:
      "Focuses on eco-friendly and sustainable products. Encourages plastic-free and organic living.",
  },
  {
    name: "BudgetBuy Store",
    email: "budgetbuy.store@gmail.com",
    address: "89 Market Road, Vijayawada",
    ownerName: "Lakshmi Devi",
    rating: 3.9,
    description:
      "Affordable shopping destination for daily needs. Popular among students and budget-conscious families.",
  },
  {
    name: "CityStop Mart",
    email: "citystop.mart@gmail.com",
    address: "210 Central Plaza, Connaught Place, Delhi",
    ownerName: "Rohit Malhotra",
    rating: 4.4,
    description:
      "A centrally located convenience store with fast service. Ideal for quick purchases and snacks.",
  },
  {
    name: "Harvest Home",
    email: "harvesthome.store@gmail.com",
    address: "33 Farm Road, Gandhinagar",
    ownerName: "Mehul Patel",
    rating: 4.6,
    description:
      "Specializes in farm-fresh and locally sourced produce. Supports local farmers and healthy living.",
  },
  {
    name: "QuickMart Express",
    email: "quickmart.express@gmail.com",
    address: "5 Metro Lane, Dwarka, Delhi",
    ownerName: "Pooja Sharma",
    rating: 4.1,
    description:
      "Designed for fast shopping with minimal wait time. Well-stocked with snacks and beverages.",
  },
  {
    name: "Everyday Essentials",
    email: "everydayessentials.shop@gmail.com",
    address: "61 Pearl Street, Trichy",
    ownerName: "Ramesh Iyer",
    rating: 4.0,
    description:
      "Provides all basic household items under one roof. Known for reliability and steady pricing.",
  },
  {
    name: "UrbanRoots Store",
    email: "urbanroots.store@gmail.com",
    address: "88 Heritage Road, Udaipur",
    ownerName: "Kavya Singh",
    rating: 4.8,
    description:
      "A boutique-style store with organic and handmade goods. Loved for its aesthetic setup and premium feel.",
  },
  {
    name: "LocalChoice Mart",
    email: "localchoice.mart@gmail.com",
    address: "19 Temple Street, Madurai",
    ownerName: "Arjun Natarajan",
    rating: 4.3,
    description:
      "A community-focused store serving local customers. Offers dependable products with personal service.",
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("DB connection OK, seeding stores...");

    const defaultPassword = "Owner@123";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    for (const s of STORES) {
      const [owner] = await User.findOrCreate({
        where: { email: s.email },
        defaults: {
          name: s.ownerName,
          email: s.email,
          address: s.address,
          password: passwordHash,
          role: "STORE_OWNER",
          is_verified: true,
          is_approved: false,
        },
      });

      await Store.findOrCreate({
        where: { name: s.name, email: s.email },
        defaults: {
          name: s.name,
          email: s.email,
          address: s.address,
          ownerId: owner.id,
          rating: s.rating,
          description: s.description,
          imageUrl: null,
        },
      });
    }

    console.log("Seed complete. Default owner password:", defaultPassword);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding stores:", err);
    process.exit(1);
  }
}

seed();

