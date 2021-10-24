const express = require('express')
const movieList = require('./movies.json')
    // require express-handlebars 
const exphbs = require('express-handlebars')
const app = express()
const port = 3000

// express template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
    // 告訴Express 要設定view engine
app.set('view engine', 'handlebars')
    // handlebars 模板引擎

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
        res.render('index', { movies: movieList.results })
    })
    // params
app.get('/movies/:movie_id', (req, res) => {
    console.log('movie_id', req.params.movie_id)
    const movie = movieList.results.find(movie => movie.id.toString() === req.params.movie_id)
    res.render('show', { movie: movie })
})

// params:id
// querystring
app.get('/search', (req, res) => {
        const keyword = req.query.keyword
        const movies = movieList.results.filter(movie => {
            // movie.title include req.query.keyword
            return movie.title.toLowerCase().includes(keyword.toLowerCase())
        })
        res.render('index', { movies: movies, keyword: req.query.keyword })
    })
    // start and listen on the Express server
app.listen(port, () => {
    console.log(`Express is listening on localhost: ${port}`)
})