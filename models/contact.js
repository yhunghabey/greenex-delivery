const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({

  fullname: {
    type: String, 
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },

  subject: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },


});

const Contact = mongoose.model('contact', contactSchema);

module.exports = {
  Contact,
};
