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
    const response = await request(app).post('/users').send({
        name: 'User',
        age: 23,
        email: 'test@email.com',
        password: 'testpass123!'
    }).expect(201)
    
    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    
    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'User',
            email: 'test@email.com'
        },
        token: user.tokens[0].token
    })
    
    //Assert that the password has been hashed
    expect(user.password).not.toBe('testpass123')
})

test('Login', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    
    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
    
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

test('Delete user', async ()=> {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
    
    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Delete user [auth error]', async ()=> {
    await request(app)
    .delete('/users/me')
    .expect(401)
})

test('Upload avatar images', async ()=> {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profilePic.png')
    expect(200)
    
    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test(`Update user's fileds`, async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({name: 'Ramiro',email:'ramita@email.com'})
    .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Ramiro')
    expect(user.email).toBe('ramita@email.com')
})