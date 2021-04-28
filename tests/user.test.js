const request = require('supertest')
const app = require('../src/app')
const { users } = require('../src/models/user')
const { testUserId, testUser, setupDatabase, testUserId2, testUser2 } = require ('./fixtures/db')

beforeEach(setupDatabase)

test('Sign up a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            "name": "Carlos Sibalatani",
            "email": "sibalatanics@outlook.com",
            "password": "Kurbeans1.",
            "role": "admin"
        })
        .expect(201)

        //Assert that database was changed
        const user = await users.findById(response.body.user._id)
        expect(user).not.toBeNull()

        //Assert response matches what was supposed to be created
        expect(response.body).toMatchObject({
            user: {
                name: 'Carlos Sibalatani',
                email: "sibalatanics@outlook.com"
            },
            token: user.tokens[0].token
        })
})

test('Login user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: testUser.email,
            password: testUser.password
        })
        .expect(200)

    const user = await users.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Do not login noexistent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'idontexist@example.com',
            password: 'Test12345.'
        })
        .expect(500)
})

test('Logout authenticated user', async () => {
    await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Do not logout unauthenticated user', async() => {
    await request(app)
        .post('/users/logout')
        .send()
        .expect(401)
})

test('Logout all unauthenticated users', async() =>{
    await request(app)
        .post('/users/logoutAll')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Do not logout all', async () => {
    await request(app)
        .post('/users/logoutAll')
        .send()
        .expect(401)
})

test('Get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Do not get user profile', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Update authenticated user', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            "name": "changed."
        })
        .expect(200)

        const user = await users.findById(testUserId)
        expect(user.name).toEqual('changed.')
})

test('Do not update unauthenticated user', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            password: "Kurbeans1."
        })
        .expect(401)
})

test('Delete user acount', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

    //Assert that user was removed from database
    const user = await users.findById(testUserId)
    expect(user).toBeNull()
})

test('Do not not update invalid fields', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            "location": "changed."
        })
        .expect(400)
})

test('Do not delete unauthenticated user account', async () =>{
    const response = await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Upload image', async () => {
    response = await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await users.findById(testUserId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})