const express = require("express");
const passport = require("passport");

const router = express.Router();

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/",
  }),
  (req, res) => {
    // redirect to frontend after success
    res.redirect("http://localhost:5173/dashboard");
  }
);

// logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:5173");
  });
});

// current user
router.get("/me", (req, res) => {
  res.json(req.user || null);
});

module.exports = router;
