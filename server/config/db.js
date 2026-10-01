import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/solahana';
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    
    // Mongoose Event Listeners
    mongoose.connection.on('error', (err) => {
      console.error(`[Database] Mongoose Connection Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] Mongoose disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[Database] Mongoose reconnected to cluster.');
    });

  } catch (error) {
    console.error(`[Database] Fatal Mongo Connection Error: ${error.message}`);
    // Non-zero exit code on initial connection failure in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
