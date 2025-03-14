const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const User = require('../models/user');

const api = request(app);

beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('securepassword', 10);
    const initialUser = new User({
        username: 'validuser',
        name: 'Valid User',
        passwordHash,
    });

    await initialUser.save();
});

test('should create a valid user', async () => {
    const newUser = {
        username: 'newuser',
        name: 'New User',
        password: 'mypassword',
    };

    const response = await api.post('/api/users').send(newUser).expect(201);
    expect(response.body.username).toBe('newuser');

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(2);
});

test('should fail if username is too short', async () => {
    const newUser = {
        username: 'ab',
        name: 'Short User',
        password: 'mypassword',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);
    expect(response.body.error).toBe('Username must be at least 3 characters long');
});

test('should fail if password is too short', async () => {
    const newUser = {
        username: 'validusername',
        name: 'Valid Name',
        password: 'ab',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);
    expect(response.body.error).toBe('Password must be at least 3 characters long');
});

test('should fail if username is not unique', async () => {
    const newUser = {
        username: 'validuser',
        name: 'Duplicate User',
        password: 'mypassword',
    };

    const response = await api.post('/api/users').send(newUser).expect(400);
    expect(response.body.error).toBe('Username must be unique');
});

test('should fail if username or password is missing', async () => {
    let response = await api.post('/api/users').send({ name: 'No Username', password: 'password123' }).expect(400);
    expect(response.body.error).toBe('Username and password are required');

    response = await api.post('/api/users').send({ username: 'nousername', name: 'No Password' }).expect(400);
    expect(response.body.error).toBe('Username and password are required');
});

afterAll(async () => {
    await mongoose.connection.close();
});
