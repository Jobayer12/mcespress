const jwt = require("jsonwebtoken");
const privateKey = process.env.PRIVATE_KEY;

exports.generateToken = information => {
  const token = jwt.sign(
    {
      token: information
    },
    privateKey,
    { expiresIn: "7d" }
  );

  return {
    token
  };
};

exports.verifyToken = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("no token found");
    return res.status(400).json({
      errors: {
        message: "Not authorization"
      }
    });
  }

  try {
    let userinfo = jwt.verify(idToken, privateKey);
    let resToken = {
      user: userinfo
    };
    req.userinfo = JSON.stringify(resToken);
    return next();
  } catch (err) {
    return res.status(400).json({
      errors: {
        message: "Invalid token"
      }
    });
  }
};
