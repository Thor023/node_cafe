const request = require('supertest')
const server = require('../index')

const creatingNewId = arr => {
    const totalIDs = arr.map(item => item.id).sort((a, b) => b - a)
    totalIDs.splice(1, totalIDs.length - 1)
    const newId = totalIDs[0] + 1
    return newId
}

describe('COFFEE CRUD', () => {

    it('200 STATUS CODE, ES UN ARREGLO CON AL MENOS 1 OBJETO.',
        async () => {
            const { body, statusCode } = await request(server).get('/cafes').send()
            expect(statusCode).toBe(200)
            expect(body).toBeInstanceOf(Array)
            expect(body.length).toBeGreaterThanOrEqual(1)
    })

    it('404 STATUS CODE AL INTENTAR BORRAR UN ID NO EXISTENTE',
        async () => {
            const jwt = 'token'
            const { body } = await request(server).get('/cafes').send()
            const idToDelete = creatingNewId(body)
            const { statusCode } = await request(server).delete(`/cafes/${idToDelete}`)
            .set('Authorization', jwt).send()
            expect(statusCode).toBe(404)
    })

    it('201 STATUS CODE AGREGANDO UN NUEVO CAFE', async () => {
        const { body } = await request(server).get('/cafes').send()
        const newID = creatingNewId(body)
        const { statusCode } = await request(server).post('/cafes').send({
            id: newID,
            nombre: 'El numbre de tu nuevo cafe!'
        })
        expect(statusCode).toBe(201)
    })

    it('400 STATUS CODE TRATAR DE ACTUALIZAR UN ID NO EXISTENTE',
        async () => {
            const { body } = await request(server).get('/cafes').send()
            const newID = creatingNewId(body)
            const firstCoffee = body[0]
            const { statusCode } = await request(server).put(`/cafes/${newID}`).send(firstCoffee)
            expect(statusCode).toBe(400)
    })
    
})