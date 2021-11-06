const express = require('express')
const restaurantList = require('./restaurant.json')
const bodyParser = require('body-parser')
const mongoose = require('mongoose') // 載入 mongoose
mongoose.connect('mongodb://localhost/restaurant-list') // 設定連線到 mongoDB
    // require express-handlebars 
const exphbs = require('express-handlebars')
const app = express()
const port = 3000
    // 連結mongoose
const Restaurant = require("./models/Restaurant")

// 取得資料庫連線狀態
const db = mongoose.connection
    // 連線異常
db.on('error', () => {
        console.log('mongodb error!')
    })
    // 連線成功
db.once('open', () => {
    console.log('mongodb connected!')
})


// express template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
    // 告訴Express 要設定view engine
app.set('view engine', 'handlebars')
    // handlebars 模板引擎

// setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
    // 瀏覽全部餐廳
app.get("/", (req, res) => {
    Restaurant.find({})
        .lean()
        .then(restaurantsData => res.render("index", { restaurantsData }))
        .catch(err => console.log(err))
})


// 搜尋特定餐廳
app.get("/search", (req, res) => {
    if (!req.query.keywords) {
        res.redirect("/")
    }

    const keywords = req.query.keywords
    const keyword = req.query.keywords.trim().toLowerCase()

    Restaurant.find({})
        .lean()
        .then(restaurantsData => {
            const filterRestaurantsData = restaurantsData.filter(
                data =>
                data.name.toLowerCase().includes(keyword) ||
                data.category.includes(keyword)
            )
            res.render("index", { restaurantsData: filterRestaurantsData, keywords })
        })
        .catch(err => console.log(err))
})

// 新增餐廳頁面
app.get("/restaurants/new", (req, res) => {
    res.render("new")
})

// 新增餐廳
app.post("/restaurants", (req, res) => {
    Restaurant.create(req.body)
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))
})


// 瀏覽特定餐廳
app.get("/restaurants/:restaurantId", (req, res) => {
    const { restaurantId } = req.params
    Restaurant.findById(restaurantId)
        .lean()
        .then(restaurantData => res.render("show", { restaurantData }))
        .catch(err => console.log(err))
})

// 編輯餐廳頁面
app.get("/restaurants/:restaurantId/edit", (req, res) => {
    const { restaurantId } = req.params
    Restaurant.findById(restaurantId)
        .lean()
        .then(restaurantData => res.render("edit", { restaurantData }))
        .catch(err => console.log(err))
})

// 更新餐廳
app.post("/restaurants/:restaurantId", (req, res) => {
    const { restaurantId } = req.params
    Restaurant.findByIdAndUpdate(restaurantId, req.body)
        .then(() => res.redirect(`/restaurants/${restaurantId}`))
        .catch(err => console.log(err))
})

// 刪除餐廳
app.post('/restaurants/:restaurantId/delete', (req, res) => {
    const id = req.params.restaurantId
    return Restaurant.findById(id)
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

// start and listen on the Express server
app.listen(port, () => {
    console.log(`Express is listening on localhost: ${port}`)
})