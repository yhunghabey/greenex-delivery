// const express = require("express");
// const multer = require("multer");
// const app = express();
// const router = express.Router();
// const cloudinary = require("cloudinary").v2;
// const crypto = require("crypto");
// const { Bookings } = require("../models/bookings");
// // Configure Multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const exist = await User.findOne({ email }).select("+password");
//   if (!exist) {
//     throw new AuthenticationError(` Invalid Credentials`);
//   }
//   const isMatch = await bcrypt.compare(password, exist.password);

//   if (isMatch) {
//     req.session.userId = exist.id; // Set user ID in session
//     return res.redirect("/dashboard");
//   } else {
//     return res.send("Invalid email or password");
//   }
// });

// router.get("/login", (req, res) => {
//   res.render("login");
// });

// router.get("/dashboard", (req, res) => {
//   res.render("dashboard");
// });

// router.get("/bookings", async (req, res) => {
//   try {
//     const bookings = await Bookings.find().sort({ createdAt: -1 });
//     res.render("admin/bookings", { bookings: bookings || [] }); // ✅ Always pass an array
//   } catch (err) {
//     console.error(err);
//     res.status(500).render("admin/bookings", { bookings: [] }); // ✅ Render empty page on error
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const { Bookings } = require("../models/bookings");

router.get("/login", (req, res) => {
  res.render("admin/login");
});

router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard");
});

router.post("/bookings/:id/edit", async (req, res) => {
  try {
    await Bookings.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/admin/bookings");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating booking");
  }
});

// router.get("/bookings", async (req, res) => {
//   try {
//     const bookings = await Bookings.find();
//     res.render("admin/bookings", { bookings });
//   } catch (err) {
//     res.status(500).send("Error fetching bookings");
//   }
// });

// List all bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Bookings.find().sort({ createdAt: -1 });
    res.render("admin/bookings", { bookings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving bookings");
  }
});

// ✅ View single booking
router.get("/bookings/:id", async (req, res) => {
  try {
    const booking = await Bookings.findById(req.params.id);
    if (!booking) return res.status(404).send("Booking not found");
    res.render("admin/bookingDetails", { booking });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching booking");
  }
});

router.get("/bookings/:id/edit", async (req, res) => {
  try {
    const booking = await Bookings.findById(req.params.id);
    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    // ✅ Pass booking to your EJS file
    res.render("admin/edit-booking", { booking });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// ✅ Update booking (form submission)
// router.post("/bookings/:id/edit", async (req, res) => {
//   try {
//     const { shippersName, receiversEmail, noOfPackages } = req.body;
//     await Bookings.findByIdAndUpdate(req.params.id, {
//       shippersName,
//       receiversEmail,
//       noOfPackages,
//     });
//     res.redirect("/admin/bookings");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating booking");
//   }
// });

// ✅ Delete booking

router.get("/bookings/:id/delete", async (req, res) => {
  try {
    await Bookings.findByIdAndDelete(req.params.id);
    res.redirect("/admin/bookings");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting booking");
  }
});

// ✅ Handle Edit Form Submission
router.post("/bookings/:id/edit", async (req, res) => {
  try {
    const updateData = {
      shippersName: req.body.shippersName,
      shippersEmail: req.body.shippersEmail,
      shippersPhoneNo: req.body.shippersPhoneNo,
      shippersAddress: req.body.shippersAddress,
      receiversName: req.body.receiversName,
      receiversEmail: req.body.receiversEmail,
      receiversPhoneNo: req.body.receiversPhoneNo,
      deliveryAddress: req.body.deliveryAddress,
      typeOfGoods: req.body.typeOfGoods,
      packageType: req.body.packageType,
      noOfPackages: req.body.noOfPackages,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      valueOfGoods: req.body.valueOfGoods,
      modeOfTransport: req.body.modeOfTransport,
      incoterms: req.body.incoterms,
      deliverySpeed: req.body.deliverySpeed,
      insurance: req.body.insurance === "Yes",
      specialHandling: req.body.specialHandling,
      pickupDate: req.body.pickupDate,
      pickupTime: req.body.pickupTime,
      deliveryDeadline: req.body.deliveryDeadline,
      paymentMethod: req.body.paymentMethod,
      billingAddress: req.body.billingAddress,
      additionalNotes: req.body.additionalNotes,
    };

    await Bookings.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin/bookings");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating booking");
  }
});

module.exports = router;
