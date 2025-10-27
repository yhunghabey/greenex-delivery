const express = require("express");
const multer = require("multer");
const app = express();
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const { Bookings } = require("../models/bookings");
// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    // const results = await User.find().sort({ createdAt: 1 }).limit(8);

    // const trainers = results.map((result) => {
    //   const parts = result.fullname.split(" ");
    //   let firstname = parts[0];
    //   let lastname = parts.slice(1).join(" ");

    //   return {
    //     ...result.toObject(),
    //     firstname,
    //     lastname,
    //   };
    // });

    res.render("public/index");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/filter", async (req, res) => {
  const trainers = req.query.searchTerm;

  const filteredProducts = user.filter((trainers) =>
    trainers.name.toLowerCase().includes(trainers.toLowerCase())
  );

  res.render("trainers", { trainers: filteredProducts });
});

router.get("/trainers", async (req, res) => {
  try {
    const trainers = await User.find();
    res.render("trainers", { trainers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/service", (req, res) => {
  res.render("public/service");
});

router.get("/track", (req, res) => {
  res.render("public/track");
});

router.get("/about-us", (req, res) => {
  res.render("public/about-us");
});

// // Example route for /track-result
// router.get("/track-result", async (req, res) => {
//   try {
//     // Suppose you fetch a booking from MongoDB based on query or params
//     const trackingId = req.query.id; // e.g., /track-result?id=124082
//     let bookingStatus = "Order Placed"; // Default status

//     // Example (if using Mongoose)
//     const booking = await Bookings.findOne({ trackingId });

//     if (booking) {
//       bookingStatus = booking.status; // e.g., "Delivered", "In Transit", etc.
//     }

//     res.render("public/track-result", {
//       bookingStatus, // ✅ this is what EJS needs
//       booking, // optional if you want more booking info
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error loading tracking result");
//   }
// });
router.get("/track-result", async (req, res) => {
  try {
    const { trackingId } = req.query;

    if (!trackingId) {
      return res.render("public/track-result", {
        bookingStatus: null,
        booking: null,
        message: "Please enter a tracking ID.",
      });
    }

    const booking = await Bookings.findOne({ trackingId });

    if (!booking) {
      return res.render("public/track-result", {
        bookingStatus: null,
        booking: null,
        message: "No booking found for this tracking ID.",
      });
    }

    res.render("public/track-result", {
      bookingStatus: booking.status,
      booking,
      message: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("public/track-result", {
      bookingStatus: null,
      booking: null,
      message: "Server error. Please try again later.",
    });
  }
});

router.get("/booking", (req, res) => {
  res.render("public/booking");
});

router.get("/coaches/:id", async (req, res) => {
  const coachId = req.params.id;
  try {
    // Fetch all coaches' data
    const results = await User.find().sort({ createdAt: 1 });

    // Find the particular coach with the given ID
    const coach = results.find((result) => result._id == coachId);

    let coachDetails = {}; // Object to store the details of the specific coach's details

    if (coach) {
      const parts = coach.fullname.split(" ");

      coachDetails = {
        coachFirstname: parts[0],
        coachLastname: parts.slice(1).join(" "),
        coachServices: coach.services,
        coachImage: coach.image,
        coachLocation: coach.location,
        coachTwitter: coach.twitter,
        coachInstagram: coach.instagram,
      };
    }

    // Filter out the coach with the given ID from the whole coaches
    const filteredResults = results.filter((result) => result._id != coachId);

    const trainers = filteredResults.map((result) => {
      const parts = result.fullname.split(" ");
      const coachData = {
        ...result.toObject(),
        firstname: parts[0],
        lastname: parts.slice(1).join(" "),
      };
      return coachData;
    });

    // Render the coaches template with the data
    res.render("coaches", { trainers, coachDetails });
  } catch (error) {
    console.error(error);
    return res.status(400).send("No Result");
  }

  // const result = await User.findOne({_id: coachId});
  // let parts = result.fullname.split(" ");
  // let firstname = parts[0];
  // let lastname = parts[1];

  // if (!result) {
  //   return res.status(400).send("No Result");
  // }
  // res.render("coaches", { result, firstname, lastname });
});

router.get("/form", (req, res) => {
  res.render("form");
});

router.post("/submitForm", (req, res) => {
  const selectedServices = req.body;
  const data = new Contact(selectedServices);
  data.save();
  res.render("contact");
});

router.get("/track/:id", async (req, res) => {
  const booking = await Bookings.findById(req.params.id);

  // booking.status could be: "Order Placed", "Picked Up", "In Transit", etc.
  res.render("public/track-result", {
    bookingStatus: booking.status,
    bookingId: booking._id,
  });
});

// app.post("/submit", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("No image uploaded");
//     }

//     // Upload to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           {
//             folder: "shipments", // Cloudinary folder name
//             resource_type: "image",
//             width: 500,
//             height: 500,
//             crop: "fill",
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         )
//         .end(req.file.buffer); // Send the in-memory file buffer to Cloudinary
//     });

//     // Create booking entry
//     const booking = new Bookings({
//       shippersName: req.body.shippersName,
//       shippersEmail: req.body.shippersEmail,
//       shippersPhoneNo: req.body.shippersPhoneNo,
//       shippersAddress: req.body.shippersAddress,
//       receiversName: req.body.receiversName,
//       receiversEmail: req.body.receiversEmail,
//       receiversPhoneNo: req.body.receiversPhoneNo,
//       deliveryAddress: req.body.deliveryAddress,
//       typeOfGoods: req.body.typeOfGoods,
//       packageType: req.body.packageType,
//       noOfPackages: req.body.noOfPackages,
//       weight: req.body.weight,
//       dimensions: req.body.dimensions,
//       valueOfGoods: req.body.valueOfGoods,
//       modeOfTransport: req.body.modeOfTransport,
//       incoterms: req.body.incoterms,
//       deliverySpeed: req.body.deliverySpeed?.toLowerCase(),
//       insurance: req.body.insurance === "Yes",
//       specialHandling: Array.isArray(req.body.specialHandling)
//         ? req.body.specialHandling.join(", ")
//         : req.body.specialHandling,
//       pickupDate: req.body.pickupDate,
//       pickupTime: req.body.pickupTime,
//       deliveryDeadline: req.body.deliveryDeadline,
//       paymentMethod: req.body.paymentMethod,
//       billingAddress: req.body.billingAddress,
//       additionalNotes: req.body.additionalNotes,
//       image: result.secure_url, // ✅ Cloudinary image URL
//     });

//     await booking.save();

//     res.render("success", {
//       message: "Shipment booked successfully!",
//       imageUrl: result.secure_url,
//     });
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     res.status(500).render("error", { message: "Error submitting form" });
//   }
// });

router.post("/submit", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image uploaded");
    }

    // ✅ Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "shipments",
            resource_type: "image",
            width: 500,
            height: 500,
            crop: "fill",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // ✅ Generate a unique tracking ID
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // e.g. 20251015
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g. A1B2C3
    const trackingId = `TRK-${datePart}-${randomPart}`;

    // ✅ Create booking entry
    const booking = new Bookings({
      trackingId,
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
      deliverySpeed: req.body.deliverySpeed?.toLowerCase(),
      insurance: req.body.insurance === "Yes",
      specialHandling: Array.isArray(req.body.specialHandling)
        ? req.body.specialHandling.join(", ")
        : req.body.specialHandling,
      pickupDate: req.body.pickupDate,
      pickupTime: req.body.pickupTime,
      deliveryDeadline: req.body.deliveryDeadline,
      paymentMethod: req.body.paymentMethod,
      billingAddress: req.body.billingAddress,
      additionalNotes: req.body.additionalNotes,
      image: result.secure_url,
    });

    await booking.save();

    // ✅ Reload the booking form with a success message
    res.render("booking", {
      success: true,
      message: `Shipment booked successfully! Your Tracking ID: ${trackingId}`,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).render("public/booking", {
      success: false,
      message: "Error submitting form. Please try again.",
    });
  }
});

module.exports = router;
