const request = require('supertest'),
    app = require('../src/app'),
    User = require('../src/models/users')

const userOne = {
    name: 'Juan',
    age: 18,
    email: 'juan@email.com',
    password: 'hello123!$'
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