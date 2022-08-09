const mongoose = require('mongoose');
const MONGO_URI = process.env.PAYMENT_SYSTEM_DB_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Mongo DB connected: ${conn.connection.host}`);
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
}

module.exports = connectDB;


