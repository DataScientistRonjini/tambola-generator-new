const jwt = require('jsonwebtoken');
const TambolaTicket = require('../models/TambolaTicket')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
var tambola = require('tambola-generator').default;


const getAllTickets = async (req, res) => {
  let data = await TambolaTicket.find().sort('createdAt')
  const totalTickets = data.length
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page-1)*limit
  const totalPages = Math.ceil(data.length / limit);

  data = data.slice(skip, skip + limit);
  res.status(StatusCodes.OK).json({ data, totalTickets: totalTickets, countPerPage:data.length, totalPages:totalPages, page:page })
}

const createTickets = async (req, res) => {
  req_dict={}
  if(!req.body.no_of_tickets){
    throw new BadRequestError("Invalid input")
  }
  req_dict.tambola_tickets=removeKeys(tambola.generateTickets(req.body.no_of_tickets))
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
  
 
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req_dict.createdBy = decoded.userId
  }
  const data = await TambolaTicket.create(req_dict)
  res.status(StatusCodes.CREATED).json({ data, msg:"Tambola tickets generated successfully!" })
}

function removeKeys(data) {
  if (Array.isArray(data)) {
    return data.map((item) => removeKeys(item));
  } else if (typeof data === 'object' && data !== null) {
    if (data.hasOwnProperty("_entries")) {
      return data["_entries"];
    } else {
      const result = {};
      for (const key in data) {
        result[key] = removeKeys(data[key]);
      }
      return result;
    }
  } else {
    return data;
  }
}

module.exports = {
    createTickets,
    getAllTickets
}
