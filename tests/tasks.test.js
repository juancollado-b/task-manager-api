const request = require('supertest'),
    app = require('../src/app'),
    {
        userOne,
        userOneId,
        setUpDataBase,
        taskOneId,
        userTwo
    } = require('./fixtures/db')
    Task = require('../src/models/tasks')
    
beforeEach(setUpDataBase)
    
test('Create Task', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'Test task'
    })
    .expect(201)

    const task = Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Get all task of an user', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
    
    expect(response.body.length).toEqual(2)
})

test('Delete task [diferent user error]', async() => {
    await request(app)
    .delete(`/tasks/${taskOneId}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(401)

    const task = Task.findById(taskOneId)
    expect(task).not.toBeNull()
})