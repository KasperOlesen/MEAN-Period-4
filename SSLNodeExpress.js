/**
 * Created by Kasper on 25-05-2016.
 */
//Ex. SSL with Node/Express and Openshift:

    app.use(function (req, res, next) {
        if ( req.headers['x-forwarded-proto'] === 'http' ) {
            var tmp= 'https://'+req.headers.host+req.originalUrl;
            res.redirect(tmp);

        } else {
            return next();
        }
    });

//Nothing in this proxy will prevent users from trying to make a HTTP request, but the proxy does set a header x-forwarded-proto which
//you can use to check for the original protocol and redirect if not HTTPS.
