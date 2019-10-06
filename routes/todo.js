const express = require('express')
const router = express.Router()

const { authenticated } = require('../config/auth')
const db = require('../models')
const User = db.User
const Todo = db.Todo

// 列出全部
router.get('/', (req, res) => {
  res.redirect('/')
})

// 新增一筆頁面(順序須排在查看單筆前，因為查看單筆路由使用params將重疊)
router.get('/new', (req, res) => {
  res.render('new')
})

// 查看一筆
router.get('/:id', (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user not found.')

      return Todo.findOne({
        where: { UserId: user.id, id: req.params.id }
      })
    })
    .then(todo => {
      return res.render('detail', { todo })
    })
    .catch(err => {
      return res.status(422).json(err)
    })
})

// 新增一筆
router.post('/', (req, res) => {
  Todo.create({
    name: req.body.item,
    done: false,
    UserId: req.user.id
  }).then(todo => {
    return res.redirect('/')
  }).catch(err => {
    return res.status(422).json(err)
  })
})

// 編輯一筆頁面
router.get('/:id/edit', (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user doesn\'t exists.')

      return Todo.findOne({ where: { UserId: user.id, id: req.params.id } })
    })
    .then(todo => {
      return res.render('edit', { todo })
    })
    .catch(err => {
      return res.status(422).json(err)
    })
})

// 編輯一筆
router.put('/:id/edit', (req, res) => {
  Todo.findOne({ where: { UserId: req.user.id, id: req.params.id } })
    .then(todo => {
      console.log(req.body);

      todo.name = req.body.item
      todo.done = req.body.done

      todo.save()
      return res.redirect(`/todos/${req.params.id}`)
    })
    .catch(err => {
      return res.status(422).json(err)
    })
})

// 刪除一筆
router.delete('/:id/delete', (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user doesn\'t exists')

      return Todo.destroy({ where: { UserId: req.user.id, id: req.params.id } })
        .then(todo => {
          return res.redirect('/')
        })
        .catch(err => {
          res.status(422).json(err)
        })
    })
})

module.exports = router