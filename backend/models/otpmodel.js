const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp: { type: Number, required: true },
    email: { type: String, required: true },
}, { timestamps: true });


otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
