
//SERVER --------------------------------------------------------------------------------------------------------------
//For all request to endpoint /api, the server will run "passport.authenticate" to authenticate the user.

app.use('/api', function (req, res, next) {
    passport.authenticate('jwt', {session: false}, function (err, user, info) {
        if (err) {
            res.status(403).json({mesage: "Token could not be authenticated", fullError: err})
        }
        if (user) {
            return next();
        }
        return res.status(403).json({mesage: "Token could not be authenticated", fullError: info});
    })(req, res, next);
});


//CLIENT -------------------------------------------------------------------------------------------------------------
module.exports = function (passport) {

    var opts = {};
    opts.secretOrKey = jwtConfig.secret;
    opts.issuer = jwtConfig.issuer;
    opts.audience = jwtConfig.audience;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("Bearer");
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        console.log("PAYLOAD: " + jwt_payload);
        User.findOne({username: jwt_payload.sub}, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user); //You could choose to return the payLoad instead
            }
            else {
                done(null, false, "User found in token not found");
            }
        })
    }))
};


//When submit() is invoked, save token from server in a session:
//($window.sessionStorage.token = data.token;).

//The factory "authInterceptor" will intercept every outgoing http request and add an authorization header with the saved token:
//(config.headers.Authorization = $window.sessionStorage.token;).

