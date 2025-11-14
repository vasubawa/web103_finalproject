require('dotenv').config()
const pool = require('../db/pool')

const dropTables = async () => {
  try {
    console.log('🗑️  Dropping tables...')
    await pool.query('DROP TABLE IF EXISTS favorites CASCADE')
    await pool.query('DROP TABLE IF EXISTS listings CASCADE')
    await pool.query('DROP TABLE IF EXISTS categories CASCADE')
    await pool.query('DROP TABLE IF EXISTS users CASCADE')
    console.log('✅ Tables dropped')
  } catch (error) {
    console.error('❌ Error dropping tables:', error.message)
  }
}

const createTables = async () => {
  try {
    console.log('🔨 Creating tables...')
    
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        githubid BIGINT NOT NULL UNIQUE,
        username VARCHAR(200) NOT NULL UNIQUE,
        avatarurl VARCHAR(500),
        accesstoken VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    // Categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `)
    
    // Listings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) DEFAULT 0,
        is_available BOOLEAN DEFAULT true,
        pickup_notes TEXT,
        location VARCHAR(255),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    
    // Favorites table (junction)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        favorited_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (user_id, listing_id)
      )
    `)
    
    console.log('✅ Tables created')
  } catch (error) {
    console.error('❌ Error creating tables:', error.message)
  }
}

const seedCategories = async () => {
  try {
    console.log('🌱 Seeding categories...')
    const categories = [
      'Furniture',
      'Electronics',
      'Tools',
      'Clothing',
      'Books',
      'Toys & Games',
      'Sports & Outdoors',
      'Home & Garden',
      'Kitchen',
      'Other'
    ]
    
    for (const name of categories) {
      await pool.query(
        'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [name]
      )
    }
    console.log('✅ Categories seeded')
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message)
  }
}

const seedTestData = async () => {
  try {
    console.log('🌱 Seeding test data...')
    
    // Create test user
    const userResult = await pool.query(`
      INSERT INTO users (githubid, username, avatarurl, accesstoken)
      VALUES (12345, 'testuser', 'https://avatars.githubusercontent.com/u/12345', 'test_token')
      ON CONFLICT (githubid) DO NOTHING
      RETURNING id
    `)
    
    if (userResult.rows.length === 0) {
      // User already exists, fetch it
      const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', ['testuser'])
      if (existingUser.rows.length === 0) {
        console.log('⚠️  Could not create or find test user')
        return
      }
      var userId = existingUser.rows[0].id
    } else {
      var userId = userResult.rows[0].id
    }
    
    // Get category IDs
    const furnitureResult = await pool.query('SELECT id FROM categories WHERE name = $1', ['Furniture'])
    const electronicsResult = await pool.query('SELECT id FROM categories WHERE name = $1', ['Electronics'])
    
    const furnitureId = furnitureResult.rows[0]?.id
    const electronicsId = electronicsResult.rows[0]?.id
    
    // Create test listings
    const listings = [
      {
        title: 'Vintage Wooden Chair',
        description: 'Beautiful oak chair from the 1960s. Some wear but very sturdy.',
        price: 45.00,
        category_id: furnitureId,
        pickup_notes: 'Available weekends, porch pickup',
        location: '123 Main St'
      },
      {
        title: 'IKEA Bookshelf',
        description: 'White bookshelf, 6ft tall. Great condition.',
        price: 30.00,
        category_id: furnitureId,
        pickup_notes: 'Must pickup by Friday',
        location: '456 Oak Ave'
      },
      {
        title: 'Gaming Monitor',
        description: '27" 144Hz gaming monitor. Works perfectly.',
        price: 150.00,
        category_id: electronicsId,
        pickup_notes: 'Includes cables',
        location: '789 Pine St'
      }
    ]
    
    for (const listing of listings) {
      await pool.query(`
        INSERT INTO listings (seller_id, category_id, title, description, price, pickup_notes, location, is_available)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      `, [userId, listing.category_id, listing.title, listing.description, listing.price, listing.pickup_notes, listing.location])
    }
    
    console.log('✅ Test data seeded')
  } catch (error) {
    console.error('❌ Error seeding test data:', error.message)
  }
}

const resetDatabase = async () => {
  console.log('🔄 Resetting database...\n')
  await dropTables()
  await createTables()
  await seedCategories()
  await seedTestData()
  console.log('\n✅ Database reset complete!')
  process.exit(0)
}

resetDatabase()
