const express = require("express");
const multer = require("multer");
const app = express();
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { Bookings } = require("../models/bookings");
const User = require("../models/user");
// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const sendZeptoMail = require("../utils/sendZeptoMail");

function isLoggedIn(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

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

router.get("/service", (req, res) => {
  res.render("public/service");
});

router.get("/track", (req, res) => {
  res.render("public/track");
});

router.get("/about-us", (req, res) => {
  res.render("public/about-us");
});

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

router.get("/booking", isLoggedIn, (req, res) => {
  res.render("public/booking", { user: req.session.user });
});

router.get("/login", (req, res) => {
  res.render("public/login", { error: null });
});

// Handle login logic
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("public/login", { error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("public/login", { error: "Invalid email or password" });
    }

    // Save user session
    req.session.user = user;
    return res.redirect("/booking");
  } catch (err) {
    console.error(err);
    res.render("public/login", { error: "Something went wrong, try again" });
  }
});

router.get("/contact", (req, res) => {
  res.render("public/contact");
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

// router.post("/submit", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("No image uploaded");
//     }

//     // ✅ Upload image to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           {
//             folder: "shipments",
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
//         .end(req.file.buffer);
//     });

//     // ✅ Generate a unique tracking ID
//     const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // e.g. 20251015
//     const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g. A1B2C3
//     const trackingId = `TRK-${datePart}-${randomPart}`;

//     // ✅ Create booking entry
//     const booking = new Bookings({
//       trackingId,
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
//       image: result.secure_url,
//     });

//     await booking.save();

//     // ✅ Reload the booking form with a success message
//     res.render("booking", {
//       success: true,
//       message: `Shipment booked successfully! Your Tracking ID: ${trackingId}`,
//     });
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     res.status(500).render("public/booking", {
//       success: false,
//       message: "Error submitting form. Please try again.",
//     });
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
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
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

    // ✅ Send shipment confirmation email to receiver
    await sendZeptoMail(
      booking.receiversEmail,
      "🚚 Your Shipment Has Been Booked | GreenEx Delivery",
      `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #f8f9fa; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #f85c00; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">GreenEx Delivery 🚚</h2>
        <p style="margin: 5px 0;">Shipment Confirmation</p>
      </div>
      
      <!-- Body -->
      <div style="padding: 25px; color: #333;">
        <h3>Dear ${booking.receiversName},</h3>
        <p>Your package has been successfully booked for delivery.</p>

        <!-- Image -->
        <div style="margin: 20px 0; text-align: center;">
          <img src="${
            booking.image
          }" alt="Package Image" style="max-width: 100%; border-radius: 8px; border: 1px solid #eee;" />
        </div>

        <!-- Shipment Info -->
        <p><strong>Tracking ID:</strong> ${trackingId}</p>
        <p><strong>Sender:</strong> ${booking.shippersName}</p>
        <p><strong>Delivery Address:</strong> ${booking.deliveryAddress}</p>
        <p><strong>Type of Goods:</strong> ${booking.typeOfGoods}</p>
        <p><strong>Package Type:</strong> ${booking.packageType}</p>
        <p><strong>Weight:</strong> ${booking.weight} kg</p>
        <p><strong>Number of Packages:</strong> ${booking.noOfPackages}</p>
        <p><strong>Estimated Delivery Date:</strong> ${
          booking.deliveryDeadline
            ? new Date(booking.deliveryDeadline).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "TBA"
        }</p>

        ${
          booking.additionalNotes
            ? `<p><strong>Additional Notes:</strong> ${booking.additionalNotes}</p>`
            : ""
        }

        <!-- Tracking link -->
        <div style="margin-top: 20px;">
          <p>You can track your shipment anytime using your tracking ID on our 
          <a href="https://greenexdelivery.com/track" 
          style="color: #f85c00; text-decoration: none;">Tracking Page</a>.</p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

        <p style="text-align: center; color: #888;">
          Thank you for choosing <strong>GreenEx Delivery</strong>.<br>
          We’ll make sure your package arrives safely and on time!
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f85c00; color: white; text-align: center; padding: 10px;">
        <small>&copy; ${new Date().getFullYear()} GreenEx Delivery. All rights reserved.</small>
      </div>
    </div>
  </div>
  `
    );
    // ✅ Render booking success page
    res.render("public/booking", {
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
