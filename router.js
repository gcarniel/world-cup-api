import Router from '@koa/router'

export const router = new Router()

router.get('/', async ctx => {
  ctx.body = {
    name: 'dunha',
    email: 'dunha@email'
  }
})

