const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  repliedBy: {
    type: String,
    default: "Admin"
  },
  repliedAt: {
    type: Date,
    default: Date.now
  }
});

const ContactSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    message: {
      type: String,
      required: true
    },


    replies: [ReplySchema],

    status: {
      type: String,
      enum: ["open", "replied", "closed"],
      default: "open"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);
