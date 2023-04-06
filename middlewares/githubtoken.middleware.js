

exports.authenticategithubaccesstoken = (req, res, next) => {
    const sessionCookie = req.headers;
    console.log(sessionCookie);
  if (sessionCookie == null) return res.sendStatus(401)
  next();
//   jwt.verify(token, process.env.JWTPRIVATEKEY, (err, data) => {
//     if (err || data.email !== req.body.email) {
//       return res.sendStatus(403)
//     }
//     next();
//   })
}
