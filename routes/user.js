const router = require('koa-router')()
const User = require('../models/user')
const fs = require('fs')
const MongoStore = require('../Store')
const store = new MongoStore()

router.prefix('/user')

// singup user
router.post('/singup', async (ctx, next) => {
  const _user = ctx.request.body.user
  try {
    const hasUser = await User.find({name: _user.name })
    console.log(hasUser)
    if (hasUser.length > 0) {
     return ctx.redirect('/admin/userlist')
    }
    const user = new User(_user)
    const dataUser = await user.save()
    await ctx.redirect('/admin/userlist')
  } catch (err) {
    console.log(err)
  }
})

router.post('/singin' , async (ctx, next) => {
  const _user = ctx.request.body.user
  const name = _user.name
  const password = _user.password
  try {
    const user = await User.findOne({ name })
    if (!user) {
      return ctx.redirect('/')
    }

    // store.destroy(ctx.cookies.get('session'))

    const isMatch = await user.comparePassword(password)
    if (isMatch) {
      ctx.session.user = user
      await ctx.redirect('/')
    }else { 
      console.log('passowrd is not match')
    }
  } catch (e) {
    console.log(e)
  }
})


module.exports = router
