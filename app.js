const express = require('express')
const restaurantList = require('./restaurant.json')
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
        res.render('index', { restaurants: restaurantList.results })
    })
    // params
app.get('/restaurants/:restaurant_id', (req, res) => {
    console.log('restaurant_id', req.params.restaurant_id)
    const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
    res.render('show', { restaurant: restaurant })
})

// params:id
// querystring
app.get('/search', (req, res) => {
        const keyword = req.query.keyword.toLowerCase().trim()
        const restaurants = restaurantList.results.filter(
            (restaurant) => restaurant.name.toLowerCase().includes(keyword) || restaurant.category.toLowerCase().includes(keyword)
        )
        res.render('index', { restaurants: restaurants, keyword: req.query.keyword })
    })
    // start and listen on the Express server
app.listen(port, () => {
    console.log(`Express is listening on localhost: ${port}`)
})