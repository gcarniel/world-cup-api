import Router from '@koa/router';
import * as users from './app/users/index.js';

export const router = new Router();

router.post('/users', users.create);
router.get('/users', users.get);
