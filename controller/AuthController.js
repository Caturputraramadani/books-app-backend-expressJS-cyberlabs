const dbConfig = require('../config/database')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const pool = mysql.createPool(dbConfig)
const {
    responseFailValidate,
    responseAuthSuccess
} = require('../traits/ApiResponse')

pool.on('error', (err) =>{
    console.error(err)
})

// rahasia
const accessTokenSecret = '2023-Wikrama-exp'

const register = (req,res) => {
    const data = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }

    if(data.email == null || data.username == null || data.password == null){
        responseFailValidate(res, 'Email/Username/Password wajib diisi')
    }else{
        const query = 'INSERT INTO users SET ?'

        const query2 = `SELECT * FROM users WHERE email= '${data.email}' OR username ='${data.username}'`

        pool.getConnection(async(err, connection) =>{
            if(err) throw err
            var checkUnique = new Promise((resolve) => {
                connection.query(query2,(err, result) => {
                  if(err) throw err

                  if(result.length > 0){
                  res.status(403).json({
                    message: 'Email/username sudah digunakan'
                  })
                  }else{
                    resolve()
                  }
                })
            })

           await checkUnique.then(() =>{
            connection.query(query, [data], (err, result) =>{
                if(err) throw err

                if(result.affectedRows >= 1){
                    const token = jwt.sign({
                        email: data.email,
                        username: data.username
                    }, accessTokenSecret) 

                    responseAuthSuccess(res, token, 'Register Successfully', {
                        email: data.email,
                        username: data.username
                    })
                }else{
                    res.status(500).json({
                        message: 'Failed creating user'
                    })
                }
            })
           })
        pool.getConnection ((err, connection) => {
        if(err) throw err
            connection.release()
        })
            
            
        })
    }
}

const login = (req, res) => {
    if (req.body.email == null || req.body.password == null) {
        responFailValidate(res, 'Email/Password wajib diisi')
        return
    }

    const { email, password } = req.body

    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}';`

    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query(query, (err, result) => {
            if (err) throw err

            if (result.length === 1) { // Perubahan di sini
                const user = result[0] // Ambil elemen pertama dari hasil

                const token = jwt.sign(
                    { email: user.email, username: user.username },
                    accessTokenSecret
                )

                responseAuthSuccess(res, token, 'Login successfully', {
                    email: user.email,
                    username: user.username
                })

                return
            }

            res.status(404).json({ message: 'Email or password is wrong' })
        })

        connection.release()
    })
}



module.exports = {
    register, login
}