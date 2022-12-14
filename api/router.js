import Router from '@koa/router';

import * as users from './users/index.js';
import * as hunches from './hunches/index.js';
import * as games from './games/index.js';

export const router = new Router();

// USUARIOS
router.post('/users', users.create);
// router.get('/users', users.get);
// router.delete('/users', users.remove);
// router.put('/users', users.update);
router.get('/login', users.login);

// PALPITES
router.post('/hunches', hunches.create);

// JOGOS
router.get('/games', games.get);

router.get('/:username', users.hunches);
