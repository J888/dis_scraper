import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import app from '../../main/app'

/* Configure chai */
chai.use(chaiHttp)
chai.should()

describe('Server', async () => {

  describe('/park-times', () => {

    it('should return the park times', (done) => {

      chai.request(app)
        .get('/park-times')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
  })
})
