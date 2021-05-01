// const User = require('../models/user');
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports.fetch_token = (req) =>
{
    if(req.query.token)
        return req.query.token;

    else if(req.headers['authorization'])    
        return req.headers['authorization'].split(' ')[1];
    
    else
        return undefined;
}

// Returns a token, given user data
module.exports.authenticate = (required_permission = undefined) => {
    return (req, res, next) => {
        const token = this.fetch_token(req);
        if(token != null)
        {
            jwt.verify(token, JWT_SECRET_KEY, (e,payload) => {
                
                if(e /* == undefined */)
                {
                    // 401 Unauthorized
                    console.log(e);
                    res.status(401).jsonp({ error : e });
                }
                else
                {
                    if(required_permission == undefined)
                    {
                        req.user = { 
                            role : payload.role,
                            username : payload.username,
                            user_id: payload.user_id
                        };
                        next();
                    }
                    else if((payload.role & required_permission) > 0)
                    {
                        req.user = { 
                            role : payload.role,
                            username : payload.username,
                            user_id: payload.user_id
                        };
                        next();
                    }
                    else
                    {
                        //console.log(payload.role);
                        // 403 Forbidden
                        res.status(403).jsonp({error: 'Forbidden! Insufficient permissions'});
                    }
                }
            });
        }
        else
        {
            // 401  Unauthorized
            console.log('Invalid token or non-existing');
            res.status(401).jsonp({error: 'Invalid token or non-existing'});
        }
    };
}

// Returns a token, given user data
module.exports.gen_token = (data) => {

    const token = jwt.sign({
        user_id: data.user_id,
        username: data.username,
        role: data.role, 
        exp: Math.floor(Date.now() / 1000) + (60*60*24*7) // Expire in a week
    } , JWT_SECRET_KEY);

    return token;
}