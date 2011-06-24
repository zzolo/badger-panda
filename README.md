This project is a voting site for Badgers versus Panda

## Basics

Using node.js, the server sets up the following:

  * Socket connect to communicate with client.
  * Client webpage

## Installing

This is currently deployable for dotcloud, but could be run
in any environment that runs node.js.

### Set up Database

1. Install CouchDB or use a CouchDB service.
3. Add the following design documents:

  _design/badger-votes
  "views": {
    "badger-votes": {
      "map": "function(doc) { if (doc.vote == 'badger') { emit(null, doc); } }"
    }
  }
   
  _design/panda-votes
  "views": {
    "panda-votes": {
      "map": "function(doc) { if (doc.vote == 'panda') { emit(null, doc); } }"
    }
  }
  
  _design/validate
  "validate_doc_update": "function (newDoc, oldDoc, user) { isAdmin = (user.roles.indexOf('_admin') != -1);  isUser = (user.roles.indexOf('user') != -1); if (!(isAdmin)) { throw({unauthorized: 'must be admin or user.'}); }  }"



### Set up Web Application

1. Install node
2. Install npm
3. Run: `npm install`
4. Copy example settings and update appropriate values: cp lib/settings.example.js lib/settings.js`
4. Run: `node lib/server.js`

## Technologies Used

This would not be possible without all these great, open source projects:

  * [Node.js](http://nodejs.org/)
  * [Socket.io](http://socket.io/)
  * [Express](http://expressjs.com/)
  * [HTML5 Boilerplate](http://html5boilerplate.com/)
  * [CSS3](http://www.w3.org/TR/CSS/#css3)
  * [jQuery](http://jquery.com/)
  * [Modernizr](http://www.modernizr.com/)