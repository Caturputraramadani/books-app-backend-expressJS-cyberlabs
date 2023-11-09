const express = require('express')
const router = express.Router()
const{
    getBooks, 
    addBook, 
    getBook,
    updateBook,
    deleteBook

} = require('../controller/BookController')

router.get('/', getBooks)
router.post('/', addBook)
router.get('/:id', getBook)
router.put('/:id', updateBook)
router.delete('/:id', deleteBook)

module.exports = router


// route untuk menampilkan data
// router.get('/', (req, res) => {
//     res.write('GET book code')
//     res.end()
// })

// route untuk mengirim data
// router.post('/', (req, res) => {
//     res.write('POST book code')
//     res.end()
// })