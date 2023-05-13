const mongoose = require('mongoose')

const tambolaTicketSchema = new mongoose.Schema({
    tambola_tickets:{
        type: [[[String]]]
    },
    createdBy: {
        type: mongoose.Types.ObjectId
      },
    },
    { timestamps: true })

module.exports = mongoose.model('TambolaTicket',tambolaTicketSchema)