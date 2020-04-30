const request = require('supertest'),
    jwt = require('jsonwebtoken'),
    { ObjectId} = require('mongoose').Types
    app = require('../src/app'),
    User = require('../src/models/users')

const userOneId = new ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Juan',
    age: 18,
    email: 'juan@email.com',
    password: 'hello123!$',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_TOKEN)
    }]
}

beforeEach(async ()=> {
    await User.deleteMany()
    await new User(userOne).save()
})
    
test('SignUp', async () => {
    await request(app).post('/users').send({
        name: 'User',
        age: 23,
        email: 'test@email.com',
        password: 'testpass123!'
    }).expect(201)
})

test('Login', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Login [error]', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'badpassword'
    }).expect(400)
})

test('Get user profile', async ()=> {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Get user profile [auth error]', async ()=> {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})