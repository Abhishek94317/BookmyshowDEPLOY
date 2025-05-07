const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    console.log("req headers", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1]; // Bearer sdafd12.asfasd12412.dsxfsdf124
    console.log("token", token);
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verified token");
    req.body.userId = verifiedToken.userId;
    next();
  } catch (err) {
    res.status(401).send({ message: "Token Invalid" });
  }
};
module.exports = auth;