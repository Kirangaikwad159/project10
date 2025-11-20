const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const logger = require('../winston');
const bcrypt = require('bcrypt');


const create = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password){
            return res.status(400).json({ message: 'Name and Email are required.'});
        }
        const salt = await bcrypt.genSalt(10)

        const hashPassword = await bcrypt.hash(password, salt);

        const newPost = await userModel.create({
            name: name,
            email: email,
            password: hashPassword,
        });

         logger.info(`New user created: ${email}`);

        res.status(201).json({
            message: 'Post created successfully',
            post: newPost
        });
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);
        console.error(error);
        res.status(500).json({ message: 'Failed to create post',error});
    }
};

const updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, email, password} = req.body;
        if (!name || !email || !password){
            return res.status(400).json({ message: "Name and email are required."});
        }

        const user = await userModel.findByPk(id);

        if (!user){
            return res.status(404).json({message: "User Not Found."});
        }

        user.name = name;
        user.email = email;
        user.password = password;

        await user.save();
        res.status(200).json({
            message:"User updated successfully!",
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Failed to update user', error});
    }
};

const deleteUser = async (req, res) =>{
    try {
        const {id} = req.params;
        const user = await userModel.findByPk(id);

        if (!user){
            logger?.warn?.(`Delete failed: User not found. ID: ${id}`);
            return res.status(404).json({message: 'User Not Found'});
        }
        await user.update({
            status: false
        })
        res.status(200).json({
            message: 'User deleted successfully!',
            user
        });
    } catch (error) {
        logger?.error?.(`Failed to delete user ID ${req.params.id}: ${error.message}`);
        console.error(error);
        res.status(500).json({message: 'Failed to deleted user', error});
    }
};

const getUser = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await userModel.findByPk(id);

        if (!user){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({
            message: 'User id successfully',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Failed to get user', error});
    }
};

const getAllUsers = async (req, res) => {
    try {
        const user = await userModel.findAll();
        
        res.status(200).json({
            message: 'Users fetched successfully',
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get users', error});
    }
};

const getUsers = async (req, res) => {
    try {
        const user = await userModel.findAll({
            where: {
                status: true,
            },
            attributes: ['id', 'name', 'email']
        });
        res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get users", error: error.message });
    }
};

const userLogin = async (req, res) =>{
    const {email, password} = req.body;
    if (!email || !password){
        return res.status(400).json({message: 'Email and Password are required'});
    }
    try {
        const user = await userModel.findOne({ where: { email }});
        if (!user){
            return res.status(404).json({ message: 'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(400).json({ message: 'Invalid credentials'});
        };

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '5h'}
        );

        res.json({
            message: 'Login successfully',
            user: {id: user.id, email: user.email},
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};

const changepassword = async (req,res)=> {
    try {
        const {oldPassword, newPassword, confirm_newPassword} = req.body
        const { id } = req.user
        if (!oldPassword || !newPassword || !confirm_newPassword){
            return res.send({"status": "failed", "message": "All fields are required"})
        } else {
            if (newPassword !== confirm_newPassword){
                return res.send ({"status": "failed", "message": "New Password and Confirm New Password doesn't match"})
            } else {
                const user = await userModel.findByPk(id)
                if (!user){
                    return res.send ({"status": "failed", "message": "user not found"})
                }
                const salt = await bcrypt.genSalt(10)
                const isMatch = await bcrypt.compare(oldPassword, user.password);
                if (!isMatch){
                    return res.send({"status": "failed", "message": "Invalid old password"})
                }
                const hash = await bcrypt.hash(newPassword, salt)
                await user.update({
                    password: hash
                })
                res.send({"status": 'success', "message": "Password changed successfully"})
            }
        }
    } catch (error) {
        console.error(error, "something went wrong")
    }
};

module.exports = {
    create,
    updateUser,
    deleteUser,
    getUser,
    userLogin,
    changepassword,
    // getAllUsers,
    getUsers,
};