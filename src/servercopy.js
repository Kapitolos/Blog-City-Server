const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Redwings!',
        database: 'Blog'
    }
})




const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(cors());


app.get('/', (req, res)=> {
    res.send(db.users);
})


app.post('/signin', (req, res) => {
    db.select('email', 'password').from('users')
      .where('email', '=', req.body.email)
      .where('password' , '=', req.body.passowrd )
          return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .where('password', '=', req.body.password)
            .then(user => {
              console.log("got here");
              res.json(user[0]);
            })
            .catch(err => res.status(400).json('unable to get user'))
        } 
)

app.post('/register', (req, res) => {
    const { email, name, password, id } = req.body;
    // Looking to have ordered id from db length but failing to find out how. This is temp.
    // const userid =  Math.floor(Math.random() * 10000);
      
      const saltRounds = 10;
      const originalPassword = password;
      const hashPassword = bcrypt.hash(originalPassword, saltRounds);
      db.transaction(trx => {
        trx.insert({
          password: password,
          email: email,
          name: name,
          id: id
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              password: password,
              joined: new Date(),
              id: id
            })
          
            // this is the response from server
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to register'))
  })
  
  app.post('/blogpost', (req, res) => {
    const { postbody, name, posttitle, id } = req.body;
      db.transaction(trx => {
        trx.insert({
          postbody: postbody,
          name: name,
          posttitle: posttitle,
          id: id
        })
        .into('blogs')
        return trx('blogs')
        .returning('*')
        .insert({
          postbody: postbody,
          posttitle: posttitle,
          name: name,
          id: id
        })
        // here we need to use the id and php to pull 
        .then(user => {
          res.json(user[0]);
        })
        // return trx('blogs')
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to register'))
  })

    app.post('/oldblogpost', (req, res) => {
    const { name, posttitle, id } = req.body;
    console.log(posttitle.replace(/['"]+/g, ''));
    console.log(id);
      db.transaction(trx => {
      trx.returning('postbody').from('blogs').where("posttitle", posttitle.replace(/['"]+/g, ''))

        .then(user => {
          res.json(user);
        })
        // return trx('blogs')
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to post old blog'))
  })

    app.post('/allblogs', (req,res) => {
      db.transaction(trx => {
        trx.returning('postbody').from('blogs')
        .then(user => {
          res.json(user)
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
        .catch(err => res.status(400).json('unable to get allblogs'))
        })


  app.post('/getposts', (req,res) => {
    const { name, id } = req.body;
    db.transaction(trx => {
    trx.returning('postbody').from('blogs').where('id', id)

          .then(user => {
          res.json(user);
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
         .catch(err => res.status(400).json('unable to show old blog'))
  })

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
           return  res.json(user);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})


app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})