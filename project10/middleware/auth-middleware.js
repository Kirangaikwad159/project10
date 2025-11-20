const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel.js'); 

const checkUserAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 

            const user = await userModel.findByPk(decoded.userId);
            if (!user) {
                return res.status(404).json({ status: "Not Found", message: "User not found" });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("JWT Error:", error.message);
            return res.status(401).json({ status: "Unauthorized", message: "Token verification failed" });
        }
    } else {
        return res.status(401).json({ status: "Unauthorized", message: "No token provided" });
    }
};

module.exports = checkUserAuth;
