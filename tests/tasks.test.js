const request = require('supertest'),
    app = require('../src/app'),
    {userOne, userOneId, setUpDataBase} = require('./fixtures/db')
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