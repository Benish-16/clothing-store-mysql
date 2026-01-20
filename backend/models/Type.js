const mongoose = require("mongoose");

const TypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
 
    },
    category: {
      type: String,
      enum: ["Men", "Women", "Child"],
      required: true
    },
    image: {
      type: String
    },
  },
  { timestamps: true }
);

TypeSchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Type", TypeSchema);
