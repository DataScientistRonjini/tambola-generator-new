const jwt = require('jsonwebtoken');
const TambolaTicket = require('../models/TambolaTicket')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')


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
  tickets=[];
  for(let i=0;i<req.body.no_of_tickets;i++){
    tickets.push(generateTicket());
  }
  req_dict.tambola_tickets=tickets
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
  
 
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req_dict.createdBy = decoded.userId
  }
  const data = await TambolaTicket.create(req_dict)
  res.status(StatusCodes.CREATED).json({ data, msg:"Tambola tickets generated successfully!" })
}

function generateTicket() {
  var cols, finalTicket, flag = true, colPlaceholder = [];
 while(flag) {
      cols = Array(9).fill(2);
      finalTicket = Array(3);
      finalTicket[0] = Array(9).fill(0);
      finalTicket[1] = Array(9).fill(0);
      finalTicket[2] = Array(9).fill(0);
      var r = getUniqueRandomNumber(0, 8, 3);
      for (i = 0; i < r.length; i++) {
          cols[r[i]] = 1;
      }
      colPlaceholder = [];
      for (i = 0; i < cols.length; i++) {
          colPlaceholder.push(getUniqueRandomNumber(0, 2, cols[i]));
      }
      for (i = 0; i < colPlaceholder.length; i++) {
          nums = getUniqueRandomNumber(((i * 10) + 1), (i * 10) + 10, colPlaceholder[i].length)
          for (j = 0; j < colPlaceholder[i].length; j++) {
              finalTicket[colPlaceholder[i][j]][i] = nums[j];
          }
      }
      flag = testFinalTicket(finalTicket);
  }
  return finalTicket;
}
Array.prototype.count = function(obj){
  var count = this.length;
  if(typeof(obj) !== "undefined"){
    var array = this.slice(0), count = 0;
    for(i = 0; i < array.length; i++){
      if(array[i] == obj){ count++ }
    }
  }
  return count;
}
function testFinalTicket(ticket){

  for (i=0;i<3;i++)
  {
      var arr = ticket[i];
      count = 0;
      for (j=0;j<arr.length;j++)
      {
          if (arr[j] === 0)
          count++;
      }
      if (count != 4)
      return true;
  }
  return false;
}

function sortNumbersinArray (a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}
function getUniqueRandomNumber (min, max, count,sort = true) {
  var random = [];
  for (var i = 0; i < count; i++) {
      flag = true;
      while (flag) {
          r = randomNumber(min, max)
          if (random.indexOf(r) === -1) {
              random.push(r);
              flag = false;
          }
      }
  }
  if (sort)
  random.sort(sortNumbersinArray)
  return random;
}
function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    createTickets,
    getAllTickets
}
