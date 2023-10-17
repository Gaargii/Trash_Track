/*const mongoose = require("mongoose");
const LoginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  type: {
    type: String,
    enum: ["user", "admin"]
  },
  image: String
});

const register = new mongoose.model("Registrationss", LoginSchema);
module.exports = register;*/
const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  type: {
    type: String,
    enum: ["user", "admin"],
  },
  image: String, // Store the image URL here
  // Add a new field to store the image location
  imageLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: false, // Location is optional for users without images
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: false, // Location is optional for users without images
    },
  },
});

const register = new mongoose.model("Registrationss", LoginSchema);
module.exports = register;

