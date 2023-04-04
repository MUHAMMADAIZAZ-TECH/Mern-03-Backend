const routes = require('express').Router();
const { authenticate } = require('../middlewares/jwt.middleware');
const userController = require('../controllers/user.controller');
const searhController =  require('../controllers/search.controller');
const follow_unfollow_Controller =  require('../controllers/follow-unfollow.controller');
const getUserList = require('../controllers/get.controller');

routes.use((req, res, next) => {
    if (req.url === '/signin' || req.url === '/signup') {
      next();
    } else {
        authenticate(req, res, next);
    }
  });
  //auth routes
routes.post('/signup', userController.signup);
routes.post('/signin', userController.signin);
 //app routes
routes.post('/search', searhController.search);
routes.post('/follow', follow_unfollow_Controller.follow);
routes.post('/unfollow', follow_unfollow_Controller.unfollow);
routes.post('/get', getUserList.getLists);


module.exports = routes;