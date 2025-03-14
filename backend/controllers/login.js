const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const express = require('express');
const loginRouter = express.Router();

const config = require('../utils/config');

const User = require('../models/user');


loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });

  if (!user) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET, {
    expiresIn: 60 * 60, // 1 hour
  });

  response.status(200).send({ token, username: user.username });
});

module.exports = loginRouter;  