---
layout: posts
title: Dealing with authentication in FeathersJS while testing with Mocha and Chai
date: 'August 16, 2016'
---
Recently I have been working on learning about <a href="http://feathersjs.com/">FeathersJS</a>. I wanted to convert a project I was currently working on <a href="https://github.com/jayzamazing/Restaurant-POS">Restaurant-POS</a> over to that framework. I installed it using the instructions on the FeathersJS website:
{% highlight ruby %}
$ npm install -g feathers-cli
$ mkdir test
$ cd test
$ feathers generate
{% endhighlight %}
Afterwards it asked a few questions to generate a base project depending on my needs:
{% highlight ruby %}
? Project name test
? Description A simple featherjs test project
? What type of API are you making? REST
? CORS configuration Enabled for all domains
? What database do you primarily want to use? MongoDB
? What authentication providers would you like to support? local
{% endhighlight %}
I also installed the following dependencies:
{% highlight ruby %}
npm install --save-dev chai chai-http
{% endhighlight %}
Instead of just querying against the user model that was already provided, I added another service:
{% highlight ruby %}
feathers generate service
{% endhighlight %}
This brings up another list of options:
{% highlight ruby %}
? What do you want to call your service? menu
? What type of service do you need? database
? For which database? MongoDB
? Does your service require users to be authenticated? yes
{% endhighlight %}
That will generate a menu folder under src/services and test/services. By saying yes to requiring users to authenticate, feathersjs generated some default authentication in src/services/menu/hooks/index.js.
{% highlight ruby %}
exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ]
  ....
}
{% endhighlight %}
Because I like the thought of role based authentication I changed that file to the following:
{% highlight ruby %}
exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [
    auth.restrictToRoles({
      roles: ['admin']
    })
  ],
  get: [
    auth.restrictToRoles({
      roles: ['admin', 'user']
    })
  ],
  create: [
    auth.restrictToRoles({
      roles: ['admin']
    })
  ],
  update: [
    auth.restrictToRoles({
      roles: ['admin']
    })
  ],
  patch: [
    auth.restrictToRoles({
      roles: ['admin']
    })
  ],
  remove: [
    auth.restrictToRoles({
      roles: ['admin']
    })
  ]
};
{% endhighlight %}
I also ended up adding role based authentication to the user hook. I updated the src/services/menu/menu-models.js to the following:
{% highlight ruby %}
name: {
  type: String,
  required: true,
  unique: true
},
price: {
  type: Number,
  required: true
},
categories: [{
  type: String,
  required: true
}],
createdAt: {
  type: Date,
  'default': Date.now
},
updatedAt: {
  type: Date,
  'default': Date.now
}
{% endhighlight %}
Next I updated the src/services/menu/user-models.js to the following:
{% highlight ruby %}
username: {
  type: String,
  required: true,
  unique: true
},
password: {
  type: String,
  require: true
},
roles: [{
  type: String,
  required: true
}],
createdAt: {
type: Date,
'default': Date.now
},
updatedAt: {
type: Date,
'default': Date.now
}
{% endhighlight %}
Because I changed the name field in the user-models.js I updated the config/default.json file to the following:
{% highlight ruby %}
"local": {
  "usernameField": "username"
}
{% endhighlight %}
Next I went to work on the test/menu/index.test.js file:
{% highlight ruby %}
'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
const Menu = app.service('menus');
const User = app.service('users');
const authentication = require('feathers-authentication/client');
const bodyParser = require('body-parser');
var token;
//config for app to do authentication
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication());
//use http plugin
chai.use(chaiHttp);
//use should
var should = chai.should();

describe('menu service', () => {
  //setup
  before((done) => {
    //start the server
    this.server = app.listen(3030);
    //once listening do the following
    this.server.once('listening', () => {
      //create some mock menu items
      Menu.create({
        name: 'hamburger',
        price: 7.99,
        categories: ['lunch', 'burgers', 'dinner']
      });
      Menu.create({
        name: 'spinach omlete',
        price: 4.99,
        categories: ['breakfast', 'omlete']
      });
      Menu.create({
        name: 'steak',
        price: 12.99,
        categories: ['dinner', 'entree']
      });
      Menu.create({
        name: 'reuben',
        price: 6.99,
        categories: ['lunch', 'sandwhich']
      });
      Menu.create({
        name: 'soft drink',
        price: 1.99,
        categories: ['drinks', 'soda']
      });
      //create mock user
      User.create({
         'username': 'resposadmin',
         'password': 'igzSwi7*Creif4V$',
         'roles': ['admin']
      }, () => {
        //setup a request to get authentication token
        chai.request(app)
            //request to /auth/local
            .post('/auth/local')
            //set header
            .set('Accept', 'application/json')
            //send credentials
            .send({
               'username': 'resposadmin',
               'password': 'igzSwi7*Creif4V$'
            })
            //when finished
            .end((err, res) => {
              //set token for auth in other requests
              token = res.body.token;
              done();
            });
      });

    });
  });
  //teardown after tests
  after((done) => {
    //delete contents of menu in mongodb
    Menu.remove(null, () => {
      User.remove(null, () => {
        //stop the server
        this.server.close(function() {});
        done();
      });
    });

  });
  it('registered the menus service', () => {
    assert.ok(app.service('menus'));
  });
  it('should post the menuitem data', function(done) {
      //setup a request
      chai.request(app)
          //request to /store
          .post('/menus')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(token))
          //attach data to request
          .send({
              name: 'shrimp fettuccine',
              price: 12.99,
              categories: 'dinner, pasta'
          })
          //when finished do the following
          .end((err, res) => {
              res.body.should.have.property('name');
              res.body.name.should.equal('shrimp fettuccine');
              res.body.should.have.property('price');
              res.body.price.should.equal(12.99);
              res.body.categories.should.be.an('array')
                  .to.include.members(['dinner, pasta']);
              done();
          });
  });
});
{% endhighlight %}
In this test file, I am creating some menu items and a user with admin rights in the before section. I also get a token in the before section. With the token, I then pass the token to the request. With this code in place, I run it with the using either piece of code:
{% highlight ruby %}
mocha test/services/menu/index.test.js

npm run test
{% endhighlight %}
