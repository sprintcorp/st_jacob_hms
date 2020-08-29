const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../model/User");

//Protect routes
exports.protect = asyncHandler(async(req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        //Set token from header
        token = req.headers.authorization.split(" ")[1];
    }
    //Set token from cookie
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }
    //make sure token exists
    if (!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
    try {
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`A user with role ${req.user.role} is not authorize to access this route`, 403));
        }
        next();
    }
}