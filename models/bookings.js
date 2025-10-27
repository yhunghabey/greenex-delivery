const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema({
  trackingId: { type: String, unique: true },
  shippersName: {
    type: String,
  },
  shippersEmail: {
    type: String,
    required: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  shippersPhoneNo: {
    type: String,
  },

  shippersAddress: {
    type: String,
  },

  receiversName: {
    type: String,
  },

  receiversEmail: {
    type: String,
  },

  receiversPhoneNo: {
    type: String,
  },

  deliveryAddress: {
    type: String,
  },

  typeOfGoods: {
    type: String,
  },
  packageType: {
    type: String,
    enum: ["Box", "Container", "Pallet", "Loose Cargo"],
  },
  noOfPackages: {
    type: Number,
    default: 1,
  },
  weight: {
    type: Number,
  },
  dimension: {
    type: String,
  },
  valueOfGoods: {
    type: Number,
  },
  modeOfTransport: {
    type: String,
    enum: ["Sea", "Air", "Truck", "Rail"],
  },
  deliverySpeed: {
    type: String,
    enum: ["standard", "express"],
  },
  incoterms: {
    type: String,
    enum: ["EXW", "FOB", "CIF", "DAP"],
  },
  insurance: {
    type: Boolean,
  },

  specialHandling: {
    type: String,
  },
  pickupDate: {
    type: Date,
  },
  pickupTime: {
    type: String,
  },
  deliveryDeadline: {
    type: Date,
  },
  image: String,

  paymentMethod: {
    type: String,
    enum: [
      "Credit Card",
      "Bank Transfer",
      "Cash On Delivery",
      "Corporate Account",
    ],
  },
  billingAddress: {
    type: String,
  },
  additionalNote: {
    type: String,
  },
  status: {
    type: String,
    enum: [
      "Order Placed",
      "Picked Up",
      "In Transit",
      "Arrived At Hub",
      "Out Of Delivery",
      "Delivery Attempt",
      "Delivered",
    ],
    default: "Order Placed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bookings = mongoose.model("bookings", bookingsSchema);

module.exports = {
  Bookings,
};
