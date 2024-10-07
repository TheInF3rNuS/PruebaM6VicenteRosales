const chai = require ('chai')
const chaiHttp = require('chai-http')
const { servidor } = require ('../index')

chai.use(chaiHttp)
describe('Obteniendo todos los animes', () =>{
    it('Comprueba que se obtiene la lista de animes', (done) =>{
        chai.request(servidor)
        .get('/anime')
        .end((error, respuesta) =>{
            console.log(respuesta.text)            
            chai.expect(respuesta).to.have.status(200)
            done()
        })



    })
})