const request = require('supertest'),
    app = require('../src/app'),
    User = require('../src/models/users')

beforeEach(async ()=> {
    await User.deleteMany()
})
    
test('SignUp', async () => {
    await request(app).post('/users').send({
        name: 'User',
        age: 23,
        email: 'test@email.com',
        password: 'testpass123!'
    }).expect(201)
})