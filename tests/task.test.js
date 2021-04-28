const request = require('supertest')
const app = require('../src/app')
const { tasks } = require('../src/models/task')
const { testUserId, testUser, setupDatabase, testUserId2, testUser2, taskOne, taskTwo, taskThree } = require ('./fixtures/db')

beforeEach(setupDatabase)

test('Create task for user', async ()=>{
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            description:'Test task'
        })
        .expect(200)
    
    const task = await tasks.findById(response.body._id)

    expect(task).not.toBeNull()
})

test('Read tasks for a user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(1)
})

test('Should not delete other users tasks', async () => {
    const response = await request(app)
    .delete(`/tasks/${taskTwo._id}`)
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(404)

    const task = tasks.findById(taskTwo._id)
    expect(task).not.toBeNull()
})