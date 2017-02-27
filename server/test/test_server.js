var chai = require('chai');
var chaiHttp = require('chai-http');
// var server = require('../server/app');
var server = require("../index.js")
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);


describe("server", function() {
  it('should be able to post', function(done) {
  chai.request(server)
    .post('/auth/register')
    .send({
        email: 'doodle@gmial.com',
        firstName: 'Jon',
        lastName: 'Mean',
        password: 'hellopassword'
      })
    .end(function(err, res){
      expect(err).to.be.null;
        expect(res).to.have.status(200);
      // res.should.have.status(200);
      // res.should.be.json;
      // res.body.should.be.a('object');
      // res.body.should.have.property('SUCCESS');
      // res.body.SUCCESS.should.be.a('object');
      // res.body.SUCCESS.should.have.property('firstName');
      // res.body.SUCCESS.should.have.property('lastName');
      // res.body.SUCCESS.should.have.property('password');
      // res.body.SUCCESS.firstName.should.equal('Jon');
      // res.body.SUCCESS.lastName.should.equal('Meas');
      done();
    });
  });

});
