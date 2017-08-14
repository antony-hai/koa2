const router = require('koa-router')()
const User = require('../models/user')
const Movie = require('../models/movie')

router.prefix('/admin')

// list page
router.get('/list', async (ctx, next) => {
  try {
    const movies = await Movie.fetch()
    await ctx.render('list', {
      title: '电影列表页',
      movies
    })
  } catch (err) {
    console.log(err)
  }
})
// userlist page
router.get('/userlist', async (ctx, next) => {
  try {
    const users = await User.fetch()
    await ctx.render('userlist', {
      title: '用户列表页',
      users
    })
  } catch (err) {
    console.log(err)
  }
})
// update by id
router.get('/update/:id', async (ctx, next) => {
  const id = ctx.params.id
  try {
    const movie = await Movie.findById(id)
    await ctx.render('admin', {
      title: '后台更新页面',
      movie
    })
  } catch (err) {
    console.log(err)
  }
})
// post movie
router.post('/movie/new', async (ctx, next) => {
  const id = ctx.request.body.movie._id
  const movieObj = ctx.request.body.movie
  let _movie
  if (id) {
    try {
      const movie = await Movie.findById(id)
      _movie = Object.assign(movie, movieObj)
      const newMovie = await _movie.save()
      await ctx.redirect(`/movie/${newMovie._id}`)
    } catch (e) {
      console.log(e)
    }
  } else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      language: movieObj.language,
      country: movieObj.country,
      summary: movieObj.summary,
      flash: movieObj.flash,
      poster: movieObj.poster,
      year: movieObj.year,
    })
    try {
      const newMovie = await _movie.save()
      await ctx.redirect(`/movie/${newMovie._id}`)
    } catch (e) {
      console.log(e)
    }
  }
})
// admin page
router.get('/new', async (ctx, next) => {
  await ctx.render('admin', {
    title: '后台录入页',
    movie: {
      title: '',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: '',
    }
  })
})

// list delete
router.delete('/list', async (ctx, next) => {
  const id = ctx.query.id
  if (id) {
    try {
      await Movie.remove({ _id: id})
      ctx.body = { success: true }
    } catch (e) {
      ctx.status = 500
      ctx.body = JSON.stringify({ success: false })
      console.log(e)
    }
  }
})

module.exports = router
