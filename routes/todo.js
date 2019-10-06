const express = require('express')
const router = express.Router()

const { authenticated } = require('../config/auth')
const { dateDiff } = require('../libs/date')
const categoryList = ['緊急重要', '緊急不重要', '不緊急重要', '不緊急不重要']

const db = require('../models')
const User = db.User
const Todo = db.Todo

// 列出全部
router.get('/', authenticated, (req, res) => {
  res.redirect('/')
})

// 新增一筆頁面(順序須排在查看單筆前，因為查看單筆路由使用params將重疊)
router.get('/new', authenticated, (req, res) => {
  const date = new Date().toJSON().split('T')[0]
  res.render('new', { categoryList, date })
})

// 查看一筆
router.get('/:id', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user not found.')

      return Todo.findOne({
        where: { UserId: user.id, id: req.params.id }
      })
    })
    .then(todo => {
      const today = new Date().toJSON().split('T')[0]
      todo.dateDiffToday = dateDiff(today, todo.deadline)
      if (todo.dateDiffToday < 0 && !todo.done) return todo.delay = true

      return res.render('detail', { todo })
    })
    .catch(err => {
      return res.status(422).json(err)
    })
})

// 新增一筆
router.post('/', authenticated, (req, res) => {
  const todo = {
    name: req.body.name,
    category: req.body.category,
    deadline: req.body.date,
    UserId: req.user.id,
    done: false,
  }

  Todo.create(todo)
    .then(todo => {
      return res.redirect('/')
    }).catch(err => {
      return res.status(422).json(err)
    })
})

// 編輯一筆頁面
router.get('/:id/edit', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user doesn\'t exists.')

      return Todo.findOne({ where: { UserId: user.id, id: req.params.id } })
    })
    .then(todo => {
      const category = todo.category
      return res.render('edit', { categoryList, todo, category })
    })
    .catch(err => {
      return res.status(422).json(err)
    })
})

// 編輯一筆
router.put('/:id/edit', authenticated, (req, res) => {
  Todo.findOne({ where: { UserId: req.user.id, id: req.params.id } })
    .then(todo => {
      Object.assign(todo, req.body)
      todo.deadline = req.body.date
      todo.done = req.body.done === 'on'

      todo.save()
      return res.redirect(`/todos`)
    })
    .catch(err => {
      return res.status(422).json(err)
    })
})

// 刪除一筆
router.delete('/:id/delete', authenticated, (req, res) => {
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