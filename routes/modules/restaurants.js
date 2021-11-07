const express = require('express')
const router = express.Router()
const Restaurant = require("../../models/Restaurant")

// 新增餐廳頁面
router.get("/new", (req, res) => {
    res.render("new")
})

// 新增餐廳
router.post("/", (req, res) => {
    Restaurant.create(req.body)
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))
})


// 瀏覽特定餐廳
router.get("/:restaurantId", (req, res) => {
    const { restaurantId } = req.params
    Restaurant.findById(restaurantId)
        .lean()
        .then(restaurantData => res.render("show", { restaurantData }))
        .catch(err => console.log(err))
})

// 編輯餐廳頁面
router.get("/:restaurantId/edit", (req, res) => {
    const { restaurantId } = req.params
    Restaurant.findById(restaurantId)
        .lean()
        .then(restaurantData => res.render("edit", { restaurantData }))
        .catch(err => console.log(err))
})

// 更新餐廳
router.put("/:restaurantId", (req, res) => {
    const { restaurantId } = req.params
    Restaurant.findByIdAndUpdate(restaurantId, req.body)
        .then(() => res.redirect(`/restaurants/${restaurantId}`))
        .catch(err => console.log(err))
})

// 刪除餐廳
router.delete('/:restaurantId', (req, res) => {
    const id = req.params.restaurantId
    return Restaurant.findById(id)
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

module.exports = router