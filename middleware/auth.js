const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  console.log(req.cookies);
  const { token } = req.cookies; //access to token
  // Authorization: "Bearer longtokenvalue";
  // const token = req.header("Authorization").replace("Bearer ", "");

  // what if token is not there
  if (!token) {
    return res.status(403).send("Token is missing");
  }

  //verify token
  try {
    const decode = jwt.verify(token, "shhhhh");
    console.log(decode);
    req.user = decode; // you get the id and email here

    // extract id from token and query the DB
  } catch (error) {
    return res.status(403).send("Token is invalid");
  }
  return next();
};

module.exports = auth;
