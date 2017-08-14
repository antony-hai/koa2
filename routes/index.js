const router = require('koa-router')()
const Movie = require('../models/movie')

// index page
router.get('/', async (ctx, next) => {
  console.log(ctx.session)
  try {
    const movies = await Movie.fetch()
    await ctx.render('index', {
      title: 'Hello KOA2',
      movies
    })
  } catch (err) {
    console.log(err)
  }
})

// detail page
router.get('/movie/:id', async (ctx, next) => {
  const id = ctx.params.id
  try {
    const movie = await Movie.findById(id)
    await ctx.render('detail', {
      title: movie.title,
      movie
    })
  } catch (err) {
    console.log(err)
  }
})


module.exports = router
