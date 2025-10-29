// const express = require("express");
// const multer = require("multer");
// const sendEmail = require("./sendEmail"); // Path to your sendEmail.js file
// const cloudinary = require("cloudinary").v2;
// const crypto = require("crypto");
// const path = require("path");
// const app = express();

// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const connectDB = require("./config/db");

// connectDB();

// app.set("view engine", "ejs");
// app.set("views", [
//   path.join(__dirname, "views/public"),
//   path.join(__dirname, "views/admin"),
// ]);
// //app.set("views", __dirname + "/views");

// app.use(bodyParser.urlencoded({ extended: true }));
// // ✅ Static folders
// app.use(express.static(path.join(__dirname, "public"))); // for public CSS/JS
// app.use("/admin", express.static(path.join(__dirname, "admin_public"))); // for admin CSS/JS

// // ✅ Routes
// const publicRoutes = require("./routes/publicRoutes");
// const adminRoutes = require("./routes/adminRoutes");

// app.use("/", publicRoutes);
// app.use("/admin", adminRoutes);

// const PORT = 3000;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: "dziiwzysj",
//   api_key: "558268698572762",
//   api_secret: "WkHksmIMqZRZu19l5JtyEizskKU",
// });

// // Middleware for file upload
// //app.use(fileUpload());

// // Configure Multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// (async () => {
//   try {
//     app.listen(PORT, (err) => {
//       if (err) {
//         console.log("Server Connection Failed");
//         throw err;
//       }
//       console.log(`Database Established to port ${PORT}`);
//     });
//   } catch (err) {
//     console.log("Database Connection Error");
//     throw err;
//   }
// })();

const express = require("express");
const multer = require("multer");
const sendEmail = require("./sendEmail"); // Path to your sendEmail.js file
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const session = require("express-session");

// Initialize express app
const app = express();
const PORT = 3000;

// ✅ Connect to MongoDB
connectDB();

app.use(
  session({
    secret: "451fd284-8cd9-4ec3-ac1e-937fbbc3b634",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set true if using HTTPS
  })
);

// ✅ Set EJS as the view engine
app.set("view engine", "ejs");

// ✅ Main views directory
// (You can access both admin and public by referencing subfolders)
app.set("views", path.join(__dirname, "views"));

// ✅ Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Static folders
app.use(express.static(path.join(__dirname, "public"))); // for public CSS/JS
app.use(
  "/admin/assets",
  express.static(path.join(__dirname, "admin_public/assets"))
); // for admin CSS/JS

// ✅ Import routes
const publicRoutes = require("./routes/publicRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ✅ Use routes
app.use("/", publicRoutes);
app.use("/admin", adminRoutes);

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: "dziiwzysj",
  api_key: "558268698572762",
  api_secret: "WkHksmIMqZRZu19l5JtyEizskKU",
});

// ✅ Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Start the server
(async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err.message);
  }
})();
