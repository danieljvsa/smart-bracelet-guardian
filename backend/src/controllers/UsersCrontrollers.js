const knex = require('../database')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const mailer = require('../modules/mailer')

require('dotenv').config()


function generateToken(params = {}){
  return jwt.sign(params, process.env.JWT_KEY, {
      expiresIn: 86400 // 24 hours
  })
}

module.exports = {
    async index(req,res) {
        knex('users').then((data) => {
            res.status(200).send(data)
        })
    },

    async create(req,res) {
        const { name, email, password} = req.body;

  
        if (name == '' || email == '' || password == '') {
            res.status(400).json('Name, email or password were not deliveried.')
        }
        else {
          const usernames = await knex('users').where({ name: name })
          const emails = await knex('users').where({ email: email })
          if(usernames.length >= 1 || emails.length >= 1){
            return res.status(400).send('Email or username already in use.')
          } else {
            knex('users').where({ email: email }).then(user => {
              const newUser = {
                name,
                email,
                password
              }
              
              bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    await knex('users').insert(newUser).catch(err => res.status(400).json(err));
                    let user = await knex('users').where({
                      email: newUser.email
                    }).select('name', 'email', 'id')
                    //console.log(user)
                    res.status(201).send({email: user[0].email, name: user[0].name, token: generateToken({ id: user[0].id })})
                  })
              })
              
            })
          }
        }
    },
    async authenticate (req,res) {
        const {email, password} = req.body
        //res.json({email: email, password: password})
        const user = await knex('users').where({
            email: email
          }).select('password', 'name', 'email', 'id')
        if (user.length === 0) {
          return res.status(400).json('That email is not registered')
        }
        console.log(user)
        // Match password
        if(!await bcrypt.compare(password, user[0].password)){
          return res.json({ message: 'Password incorrect' })
        }

        user[0].password = undefined
        //console.log(user[0].id)
        return res.status(200).send({email: user[0].email,name: user[0].name, token: generateToken({ id: user[0].id })})
        
    },

    async forgot_password(req,res){
      const {email} = req.body
      try {
        const user = await knex('users').where({email: email})
        console.log(user[0])
        if (!user[0]) {
          return res.status(401).json('No User found with this email.')
        }

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await knex('users').update({
            passwordResetToken: token,
            passwordResetExpires: now
        }).where({id: user[0].id})

        mailer.sendMail({
          to: email,
          from: "danielviana18@gmail.com",
          template: 'auth/forgot_password',
          subject: 'Password reset',
          context: {token}
        }, (err) => {
          if (err) {
            console.log(err)
            return res.status(400).json('Cannot send token')
          }
          res.status(200).send('Email sent!')
        })

      } catch (error) {
        return res.status(400).json('Error on forgot password, try again')
      }
    },

    async reset_password(req,res){
      const {email, token, password} = req.body

      try {
        const user = await knex('users').where({email: email}).select('passwordResetToken', 'passwordResetExpires', 'password', 'email')

        if (!user) {
          return res.status(401).json('No User found with this email.')
        }

        if (token !== user[0].passwordResetToken) {
          return res.status(401).json('Token invalid.')
        }

        const now = new Date()

        if (now > user[0].passwordResetExpires) {
          return res.status(401).json('Token expired.')
        }

        user[0].password = password

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user[0].password, salt, async (err, hash) => {
            if (err) throw err;
            //console.log(hash)
            user[0].password = hash;
            console.log(user[0].password)
            await knex('users').where({email: user[0].email}).update({password: user[0].password})
        })})
        //console.log(user[0].password)
        //await knex('users').where({email: user[0].email}).update({password: user[0].password})
        return res.status(200).send('Password reseted.')
      } catch (error) {
        console.log(error)
        return res.status(400).json('Error on reset password, try again')
      }
    }
}