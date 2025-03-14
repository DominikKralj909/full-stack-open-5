require('dotenv').config();

const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI;
const SECRET = process.env.SECRET || 'secret';

module.exports = { PORT, MONGODB_URI, SECRET }
