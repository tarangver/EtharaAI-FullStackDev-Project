require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('./models/User');

const validateMongoUri = (mongoUri) => {
  try {
    const parsedUri = new URL(mongoUri);
    const isMongoProtocol =
      parsedUri.protocol === 'mongodb:' || parsedUri.protocol === 'mongodb+srv:';

    if (!isMongoProtocol) {
      throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
    }

    if (!parsedUri.hostname) {
      throw new Error('MONGODB_URI is missing a database host');
    }

    if (parsedUri.protocol === 'mongodb+srv:' && !parsedUri.hostname.includes('.')) {
      throw new Error(
        `MONGODB_URI SRV host looks invalid: "${parsedUri.hostname}". Check for an extra "@" in the username/password section.`
      );
    }
  } catch (error) {
    throw new Error(`Invalid MONGODB_URI: ${error.message}`);
  }
};

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    validateMongoUri(mongoUri);
    await mongoose.connect(mongoUri);

    console.log('✓ Connected to MongoDB for seeding');

    // Delete existing demo users
    await User.deleteMany({
      email: { $in: ['admin@demo.com', 'member@demo.com'] },
    });

    console.log('✓ Removed existing demo users');

    // Create admin user
    const adminPassword = await bcryptjs.hash('Admin@123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'admin',
    });
    await adminUser.save();
    console.log('✓ Created admin user: admin@demo.com / Admin@123');

    // Create member user
    const memberPassword = await bcryptjs.hash('Member@123', 10);
    const memberUser = new User({
      name: 'Member User',
      email: 'member@demo.com',
      password: memberPassword,
      role: 'member',
    });
    await memberUser.save();
    console.log('✓ Created member user: member@demo.com / Member@123');

    console.log('\n✓ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
