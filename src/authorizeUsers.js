// // middleware for doing role-based permissions
exports.authorize = (...permittedRoles) =>{
    return (req, res, next) => {
        const payload  = req.decoded
        //console.log('Payload:',payload);
        console.log("permittedRoles: ",...permittedRoles);
        if ((payload && permittedRoles.includes(payload.role)) || (payload && permittedRoles.includes(payload.isSuperAdmin))) {
            //console.log("payload:",payload.merchantID);
            next(); // role is allowed, so continue on the next middleware
        }
        else {
            res.status(403).json({message: "Authentication Error | Unauthorised"}); // user is forbidden
        }
    }
}