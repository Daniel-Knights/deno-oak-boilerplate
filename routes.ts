import { Router } from 'https://deno.land/x/oak@v6.0.1/mod.ts';

import auth from './middleware/auth.ts';

// Controllers
import PostsController from './controllers/PostsController.ts';
import UsersController from './controllers/UsersController.ts';

const router = new Router();

// Post routes
router.get('/api/posts', PostsController.get_all);
router.get('/api/posts/:id', PostsController.get_single);
router.post('/api/posts', auth, PostsController.create);
router.delete('/api/posts/:id', auth, PostsController.delete);

// User routes
router.get('/api/users', auth, UsersController.get_user);
router.post('/api/users/login', UsersController.login);
router.post('/api/users/signup', UsersController.signup);

export default router;
