const mysql = require('mysql2');
const dbConfig = require('../config/database');
const { 
    responseNotFound, 
    responseSuccess 
} = require('../traits/ApiResponse');

const pool = mysql.createPool(dbConfig);

const search = (req,res) =>{
    const keyword = req.query.keyword

    const query = `SELECT * FROM books WHERE nama LIKE '%${keyword}%`

    pool.getConnection((err,connection) =>{
        if(err) throw err
        
        connection.query(query, (err, results) =>{
            if(err) throw err
            
            if(results.length == 0){
                return res.json({
                    message: 'Data tidak dapat ditemukan'
                })
            }

            responseSuccess(res, results, 'Book Successfully fetched')
        })
        connection.release()
    })
}

const sortBy = (req, res) =>{
    const orderBy = req.query.order
    // desc/asc
    const query = `SELECT * FROM books ORDER BY nama ${orderBy}`
    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, (err, results) =>{
            if(err) throw err
            if(results.length == 0){
                responseNotFound(res)
                return
            }
            responseSuccess(res, results, 'Book Successfully fetched')

        })
        connection.release()
    })

}

const getBooks = (req, res) => {
    const query = 'SELECT * from books';

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(query, (err, result) => {
            if (err) throw err;

            responseSuccess(res, result, 'Books successfully fetched!');
            connection.release(); 
        });
    });
};

const getBook = (req, res) =>{
    const id = req.params.id
    const query = `SELECT * FROM books WHERE id= ${id}`
    pool.getConnection((err, connection) =>{
        if(err) throw err
        connection.query(query, (err, result) =>{
            if (err) throw err
            if(result.length == 0){
                responseNotFound(res)
                return
            }
            responseSuccess(res, result, 'Books successfully fetched!')
        })
        connection.release(); 
    })
}

const addBook = (req, res) =>{
    const data ={
        nama: req.body.nama,
        author: req.body.author,
        year: req.body.year,
        page_count: req.body.page_count,
        publisher: req.body.publisher
    }

    const query = 'INSERT INTO books SET ?'

    pool.getConnection((err, connection) =>{
        if(err) throw err
        connection.query(query, [data], (err, result) =>{
            if (err) throw err
            responseSuccess(res, result, 'Books successfully Added!')
        })
        connection.release(); 
    })
}

const updateBook = (req, res) =>{
    const id = req.params.id
    const data ={
        nama: req.body.nama,
        author: req.body.author,
        year: req.body.year,
        page_count: req.body.page_count,
        publisher: req.body.publisher
    }

    const query = `UPDATE books SET ? WHERE id=${id}`

    pool.getConnection((err, connection) =>{
        if(err) throw err

        connection.query(query, [data], (err, result) =>{
            if (err) throw err

            if(result.affectedRows == 0){
                responseNotFound(res)
                return
            }
            responseSuccess(res, result, 'Books successfully Updeted!')
        })
        connection.release(); 
    })
}

const deleteBook = (req, res) =>{
    const id = req.params.id
    const query = `DELETE FROM books WHERE id=${id}`

    pool.getConnection((err, connection) =>{
        if(err) throw err

        connection.query(query, (err, result) =>{
            if (err) throw err

            if(result.affectedRows == 0){
                responseNotFound(res)
                return
            }
            responseSuccess(res, result, 'Books successfully Deleted!')
        })
        connection.release(); 
    })
}



module.exports = {
    getBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook,
    search,
    sortBy
    
};
