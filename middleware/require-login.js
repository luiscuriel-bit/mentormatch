const requireLogin = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect("/auth/sign-in");
};

module.exports = requireLogin;