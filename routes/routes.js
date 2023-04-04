const routes = require('express').Router();
const { authenticate } = require('../middlewares/jwt.middleware');
const userController = require('../controllers/user.controller');
const passwordresetController = require('../controllers/passwordReset');
// routes.use((req, res, next) => {
//     if (req.url === '/signin' || req.url === '/signup') {
//       next();
//     } else {
//         authenticate(req, res, next);
//     }
//   });
  //auth routes
routes.post('/signup', userController.signup);
routes.post('/signin', userController.signin);
routes.get("/:id/verify/:token/",userController.emailverification);
//password reset
routes.post('/password-reset',passwordresetController.sendpasswordlink);
routes.get("/password-reset/:id/:token",passwordresetController.verifyurl);
routes.post("/password-reset/:id/:token",passwordresetController.newpassword);
 //app routes


module.exports = routes;