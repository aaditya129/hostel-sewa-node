const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded); // ✅ Debug log

    req.user = decoded.user || decoded.admin || decoded.currentUser; // ✅ Ensure the correct user object

    if (!req.user) {
      console.error("Auth Error: req.user is undefined");
      return res.status(401).json({ msg: "Invalid token structure" });
    }

    console.log("Authenticated User:", req.user); // ✅ Debugging log

    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
