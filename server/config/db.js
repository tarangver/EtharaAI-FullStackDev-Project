const mongoose = require('mongoose');

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

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    validateMongoUri(mongoUri);
    await mongoose.connect(mongoUri);

    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
