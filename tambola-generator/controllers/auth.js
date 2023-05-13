const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const register = async(req, res)=>{
    const {password, confirm_password} = req.body
    if(confirm_password!=password){
        throw new BadRequestError('Password mismatch')
    }
    const user = await User.create({...req.body})
    
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.username},token})
}

const login = async (req, res) =>{
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid email')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid password')
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({username:user.username, token})
}

const dashboard = async (req, res)=>{
    const luckyNumber = Math.floor(Math.random()*100)
        res.status(200).json({
            msg:`Hello, ${req.user.username}`,
            secret:`Here is your authorized data, your lucky number is ${luckyNumber}`
        })

    
}

module.exports = {
    register,
    login,
    dashboard
}