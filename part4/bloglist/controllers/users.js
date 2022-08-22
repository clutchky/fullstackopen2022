const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { user: 0, likes: 0 });

  response.json(users);
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body;

  if (!username && !password) {
    return response.status(400).json({
      error: 'username and password required'
    });
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    });
  }

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters or more'
    })
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
    name
  });

  const savedUser = await user.save();

  response.status(200).json(savedUser);
});

module.exports = usersRouter;