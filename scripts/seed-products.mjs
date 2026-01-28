// Seed script to populate products with current pricing from Pedego and Urtopia
// Run with: node scripts/seed-products.mjs

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const pedegoProducts = [
  {
    name: 'Pedego Avenue',
    slug: 'pedego-avenue',
    shortDescription: 'Sleek, versatile, value-priced e-bike for city commuting',
    description: 'The Pedego Avenue is a sleek, versatile, value-priced e-bike perfect for city commuting. Features a comfortable upright riding position and reliable performance.',
    price: '1999.00',
    category: 'cruiser',
    brand: 'Pedego',
    image: '/pedego-avenue.webp',
    features: JSON.stringify(['20 MPH Top Speed', 'Up to 56 Miles Range', 'Fits 4\'11" to 6\'4"+']),
    specifications: JSON.stringify({ topSpeed: '20 MPH', range: '56 miles', riderHeight: '4\'11" to 6\'4"+' }),
    stock: 3,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Pedego Interceptor',
    slug: 'pedego-interceptor',
    shortDescription: 'Classic cruiser style with powerful performance',
    description: 'The Pedego Interceptor combines classic cruiser style with powerful electric performance. Perfect for beach cruising and neighborhood rides.',
    price: '1949.00',
    category: 'cruiser',
    brand: 'Pedego',
    image: '/pedego-interceptor.webp',
    features: JSON.stringify(['20 or 28 MPH Top Speed', 'Up to 75 Miles Range', 'Fits 4\'11" to 6\'0"+']),
    specifications: JSON.stringify({ topSpeed: '20 or 28 MPH', range: '75 miles', riderHeight: '4\'11" to 6\'0"+' }),
    stock: 5,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Pedego Interceptor Platinum Edition',
    slug: 'pedego-interceptor-platinum',
    shortDescription: 'Premium cruiser with upgraded components',
    description: 'The Pedego Interceptor Platinum Edition features premium components and enhanced performance for the discerning rider.',
    price: '2499.00',
    category: 'cruiser',
    brand: 'Pedego',
    image: '/pedego-interceptor-platinum.webp',
    features: JSON.stringify(['20 or 28 MPH Top Speed', 'Up to 75 Miles Range', 'Premium Components']),
    specifications: JSON.stringify({ topSpeed: '20 or 28 MPH', range: '75 miles', riderHeight: '4\'11" to 6\'0"+' }),
    stock: 2,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Pedego Boomerang',
    slug: 'pedego-boomerang',
    shortDescription: 'Ultra-low step-thru frame for easy mounting',
    description: 'The Pedego Boomerang features an ultra-low 9" step-thru frame, making it the most accessible electric bike ever. Perfect for riders of all abilities.',
    price: '2495.00',
    category: 'cruiser',
    brand: 'Pedego',
    image: '/pedego-boomerang.webp',
    features: JSON.stringify(['20 or 28 MPH Top Speed', 'Up to 75 Miles Range', '9" Step-Thru Frame']),
    specifications: JSON.stringify({ topSpeed: '20 or 28 MPH', range: '75 miles', riderHeight: '4\'10" to 6\'3"+', stepThru: '9 inches' }),
    stock: 4,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Pedego Boomerang Platinum Edition',
    slug: 'pedego-boomerang-platinum',
    shortDescription: 'Premium step-thru with upgraded features',
    description: 'The Pedego Boomerang Platinum Edition combines the accessible step-thru design with premium components and enhanced performance.',
    price: '3049.00',
    category: 'cruiser',
    brand: 'Pedego',
    image: '/pedego-boomerang-platinum.webp',
    features: JSON.stringify(['20 or 28 MPH Top Speed', 'Up to 75 Miles Range', 'Premium Components']),
    specifications: JSON.stringify({ topSpeed: '20 or 28 MPH', range: '75 miles', riderHeight: '5\'2"+' }),
    stock: 1,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Pedego Element',
    slug: 'pedego-element',
    shortDescription: 'Affordable fat tire e-bike for all terrains',
    description: 'The Pedego Element is an affordable fat tire e-bike designed for all terrains. Features 20" x 4" fat tires for stability and comfort.',
    price: '1999.00',
    category: 'fat-tire',
    brand: 'Pedego',
    image: '/pedego-element.webp',
    features: JSON.stringify(['20 MPH Top Speed', 'Up to 56 Miles Range', '20" x 4" Fat Tires']),
    specifications: JSON.stringify({ topSpeed: '20 MPH', range: '56 miles', tires: '20" x 4" Fat Tires' }),
    stock: 3,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Pedego Element Platinum Edition',
    slug: 'pedego-element-platinum',
    shortDescription: 'Premium fat tire with enhanced performance',
    description: 'The Pedego Element Platinum Edition offers enhanced performance with premium components and Class 3 speed capability.',
    price: '2549.00',
    category: 'fat-tire',
    brand: 'Pedego',
    image: '/pedego-element-platinum.webp',
    features: JSON.stringify(['20 or 28 MPH Top Speed', 'Up to 56 Miles Range', 'Premium Components']),
    specifications: JSON.stringify({ topSpeed: '20 or 28 MPH', range: '56 miles', tires: '20" x 4" Fat Tires' }),
    stock: 2,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Pedego City Commuter',
    slug: 'pedego-city-commuter',
    shortDescription: 'Perfect for daily commuting',
    description: 'The Pedego City Commuter is designed for daily commuting with a comfortable upright position and reliable performance.',
    price: '1299.00',
    salePrice: '1795.00',
    category: 'cruiser',
    brand: 'Pedego',
    image: '/pedego-city-commuter.webp',
    features: JSON.stringify(['Up to 28 MPH Top Speed', 'Up to 75 Miles Range', 'Commuter Design']),
    specifications: JSON.stringify({ topSpeed: 'Up to 28 MPH', range: '75 miles', riderHeight: '5\'2" to 5\'10"+' }),
    stock: 2,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Pedego Cargo',
    slug: 'pedego-cargo',
    shortDescription: 'Haul everything with ease',
    description: 'The Pedego Cargo is built for hauling. With a massive range and strong motor, it can handle groceries, kids, or gear with ease.',
    price: '3495.00',
    salePrice: '3895.00',
    category: 'cargo',
    brand: 'Pedego',
    image: '/pedego-cargo.webp',
    features: JSON.stringify(['20 or 28 MPH Top Speed', 'Up to 132 Miles Range', 'Heavy Duty Cargo Capacity']),
    specifications: JSON.stringify({ topSpeed: '20 or 28 MPH', range: '132 miles', cargoCapacity: 'Heavy Duty' }),
    stock: 1,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Pedego MOTO',
    slug: 'pedego-moto',
    shortDescription: 'NEW - Motorcycle-inspired e-bike',
    description: 'The all-new Pedego MOTO brings motorcycle-inspired styling to the e-bike world. Powerful performance with head-turning design.',
    price: '3995.00',
    category: 'fat-tire',
    brand: 'Pedego',
    image: '/pedego-moto.webp',
    features: JSON.stringify(['Up to 28 MPH Top Speed', 'Up to 75 Miles Range', 'Motorcycle-Inspired Design']),
    specifications: JSON.stringify({ topSpeed: 'Up to 28 MPH', range: '75 miles' }),
    stock: 2,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Pedego Fat Tire Trike',
    slug: 'pedego-fat-tire-trike',
    shortDescription: 'NEW - Three-wheel stability with fat tires',
    description: 'The new Pedego Fat Tire Trike offers three-wheel stability combined with fat tire traction. Perfect for riders seeking extra balance.',
    price: '3295.00',
    category: 'cruiser',
    brand: 'Pedego',
    image: '/pedego-fat-tire-trike.webp',
    features: JSON.stringify(['15 MPH Top Speed', 'Up to 75 Miles Range', 'Three-Wheel Stability']),
    specifications: JSON.stringify({ topSpeed: '15 MPH', range: '75 miles', riderHeight: '4\'11" to 6\'4"+', wheels: '3' }),
    stock: 1,
    isActive: true,
    isFeatured: false
  }
];

const urtopiaProducts = [
  {
    name: 'Urtopia Carbon Classic',
    slug: 'urtopia-carbon-classic',
    shortDescription: 'Effortless rides, timeless carbon style',
    description: 'The Urtopia Carbon Classic combines effortless rides with timeless carbon fiber style. Ultra-lightweight at just 38 lbs with 75 miles range.',
    price: '1999.00',
    salePrice: '2299.00',
    category: 'cruiser',
    brand: 'Urtopia',
    image: '/urtopia-carbon-classic.webp',
    features: JSON.stringify(['38 lbs Carbon Fiber', '75 Miles Range', '750W Peak Power', 'Throttle']),
    specifications: JSON.stringify({ weight: '38 lbs', range: '75 miles', motor: '750W Peak', material: 'Carbon Fiber' }),
    stock: 2,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Urtopia Carbon Classic Step-Thru',
    slug: 'urtopia-carbon-classic-step-thru',
    shortDescription: 'Relaxed cruiser for everyday city use',
    description: 'The Urtopia Carbon Classic Step-Thru offers a relaxed cruiser design for everyday city use with easy step-through access.',
    price: '1999.00',
    salePrice: '2299.00',
    category: 'cruiser',
    brand: 'Urtopia',
    image: '/urtopia-carbon-classic-st.webp',
    features: JSON.stringify(['38 lbs Carbon Fiber', '75 Miles Range', '750W Peak Power', 'Step-Thru Design']),
    specifications: JSON.stringify({ weight: '38 lbs', range: '75 miles', motor: '750W Peak', material: 'Carbon Fiber' }),
    stock: 2,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Urtopia Carbon 1 Pro',
    slug: 'urtopia-carbon-1-pro',
    shortDescription: 'City commuting and workout',
    description: 'The Urtopia Carbon 1 Pro is designed for city commuting and fitness. Features GPS tracking and smart connectivity.',
    price: '2199.00',
    salePrice: '2499.00',
    category: 'cruiser',
    brand: 'Urtopia',
    image: '/urtopia-carbon-1-pro.webp',
    features: JSON.stringify(['37 lbs Carbon Fiber', '80 Miles Range', '350W Motor', 'GPS Tracking']),
    specifications: JSON.stringify({ weight: '37 lbs', range: '80 miles', motor: '350W', material: 'Carbon Fiber', gps: true }),
    stock: 3,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Urtopia Carbon 1 Step-Thru',
    slug: 'urtopia-carbon-1-step-thru',
    shortDescription: 'Leisure cruising and sightseeing',
    description: 'The Urtopia Carbon 1 Step-Thru is perfect for leisure cruising and sightseeing with easy step-through access and GPS tracking.',
    price: '2199.00',
    salePrice: '2499.00',
    category: 'cruiser',
    brand: 'Urtopia',
    image: '/urtopia-carbon-1-st.webp',
    features: JSON.stringify(['36 lbs Carbon Fiber', '80 Miles Range', '350W Motor', 'GPS Tracking']),
    specifications: JSON.stringify({ weight: '36 lbs', range: '80 miles', motor: '350W', material: 'Carbon Fiber', gps: true }),
    stock: 2,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Urtopia Joy Carbon',
    slug: 'urtopia-joy-carbon',
    shortDescription: 'All-terrain, cargo, family-friendly ride',
    description: 'The Urtopia Joy Carbon is an all-terrain, cargo-capable, family-friendly e-bike. Versatile design for any adventure.',
    price: '1899.00',
    salePrice: '1999.00',
    category: 'cargo',
    brand: 'Urtopia',
    image: '/urtopia-joy-carbon.webp',
    features: JSON.stringify(['45 lbs Carbon Fiber', '70 Miles Range', '500W Motor', 'Throttle', 'Cargo Capable']),
    specifications: JSON.stringify({ weight: '45 lbs', range: '70 miles', motor: '500W', material: 'Carbon Fiber' }),
    stock: 2,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Urtopia Joy Carbon Ultra',
    slug: 'urtopia-joy-carbon-ultra',
    shortDescription: 'Light to ride, comfy to cruise, built tough',
    description: 'The Urtopia Joy Carbon Ultra is light to ride, comfortable to cruise, and built tough for any terrain.',
    price: '2199.00',
    salePrice: '2499.00',
    category: 'cargo',
    brand: 'Urtopia',
    image: '/urtopia-joy-ultra.webp',
    features: JSON.stringify(['42 lbs Carbon Fiber', '70 Miles Range', '500W Motor', 'Throttle']),
    specifications: JSON.stringify({ weight: '42 lbs', range: '70 miles', motor: '500W', material: 'Carbon Fiber' }),
    stock: 1,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Urtopia Carbon Fold 1',
    slug: 'urtopia-carbon-fold-1',
    shortDescription: 'Lightest and smallest foldable ebike',
    description: 'The Urtopia Carbon Fold 1 is the world\'s lightest foldable e-bike at just 29 lbs. Perfect for commuters and travelers.',
    price: '1799.00',
    salePrice: '1999.00',
    category: 'cruiser',
    brand: 'Urtopia',
    image: '/urtopia-carbon-fold-1.webp',
    features: JSON.stringify(['29 lbs - Lightest Foldable', '40 Miles Range', '2-Step Folding', 'Torque Sensor']),
    specifications: JSON.stringify({ weight: '29 lbs', range: '40 miles', folding: '2-Step', material: 'Carbon Fiber' }),
    stock: 2,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Urtopia Carbon Fold Step-Thru',
    slug: 'urtopia-carbon-fold-step-thru',
    shortDescription: 'Light to ride, comfy to cruise, built tough',
    description: 'The Urtopia Carbon Fold Step-Thru combines folding convenience with step-through accessibility.',
    price: '1599.00',
    salePrice: '1799.00',
    category: 'cruiser',
    brand: 'Urtopia',
    image: '/urtopia-carbon-fold-st.webp',
    features: JSON.stringify(['31 lbs Carbon Fiber', '50 Miles Range', '2-Step Folding', 'Torque Sensor']),
    specifications: JSON.stringify({ weight: '31 lbs', range: '50 miles', folding: '2-Step', material: 'Carbon Fiber' }),
    stock: 2,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Urtopia Carbon Fusion Pro',
    slug: 'urtopia-carbon-fusion-pro',
    shortDescription: 'Explore further with dual battery range',
    description: 'The Urtopia Carbon Fusion Pro features dual battery technology for an incredible 120 mile range. Perfect for long adventures.',
    price: '2199.00',
    salePrice: '2499.00',
    category: 'fat-tire',
    brand: 'Urtopia',
    image: '/urtopia-fusion-pro.webp',
    features: JSON.stringify(['48 lbs Carbon Fiber', '120 Miles Range', '500W Motor', 'Dual Battery', 'Throttle']),
    specifications: JSON.stringify({ weight: '48 lbs', range: '120 miles', motor: '500W', material: 'Carbon Fiber', battery: 'Dual' }),
    stock: 2,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Urtopia Carbon Fusion GT',
    slug: 'urtopia-carbon-fusion-gt',
    shortDescription: 'All-day, all-terrain adventures',
    description: 'The Urtopia Carbon Fusion GT is built for all-day, all-terrain adventures with dual motors and 120 mile range.',
    price: '2799.00',
    category: 'fat-tire',
    brand: 'Urtopia',
    image: '/urtopia-fusion-gt.webp',
    features: JSON.stringify(['48 lbs Carbon Fiber', '120 Miles Range', '700W Motor', 'Dual Battery', 'All-Terrain']),
    specifications: JSON.stringify({ weight: '48 lbs', range: '120 miles', motor: '700W', material: 'Carbon Fiber', battery: 'Dual' }),
    stock: 1,
    isActive: true,
    isFeatured: true
  }
];

async function seedProducts() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Clear existing products
    console.log('Clearing existing products...');
    await connection.execute('DELETE FROM products');
    
    // Insert Pedego products
    console.log('Inserting Pedego products...');
    for (const product of pedegoProducts) {
      await connection.execute(
        `INSERT INTO products (name, slug, shortDescription, description, price, salePrice, category, brand, image, features, specifications, stock, isActive, isFeatured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.slug,
          product.shortDescription,
          product.description,
          product.price,
          product.salePrice || null,
          product.category,
          product.brand,
          product.image,
          product.features,
          product.specifications,
          product.stock,
          product.isActive,
          product.isFeatured
        ]
      );
      console.log(`  ✓ ${product.name}`);
    }
    
    // Insert Urtopia products
    console.log('Inserting Urtopia products...');
    for (const product of urtopiaProducts) {
      await connection.execute(
        `INSERT INTO products (name, slug, shortDescription, description, price, salePrice, category, brand, image, features, specifications, stock, isActive, isFeatured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.slug,
          product.shortDescription,
          product.description,
          product.price,
          product.salePrice || null,
          product.category,
          product.brand,
          product.image,
          product.features,
          product.specifications,
          product.stock,
          product.isActive,
          product.isFeatured
        ]
      );
      console.log(`  ✓ ${product.name}`);
    }
    
    console.log('\\n✅ Product seeding complete!');
    console.log(`   Pedego products: ${pedegoProducts.length}`);
    console.log(`   Urtopia products: ${urtopiaProducts.length}`);
    console.log(`   Total: ${pedegoProducts.length + urtopiaProducts.length}`);
    
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedProducts();
