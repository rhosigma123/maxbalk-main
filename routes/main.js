const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const slugify = require("slugify");
const slug = require("slug");
const { create } = require("xmlbuilder2");
const nodemailer = require("nodemailer");
const request = require("request");

// Model
const User = require("../models/User");
const Blog = require("../models/Blog");
const Testimonial = require("../models/Testimonial");
const CaseStudy = require("../models/CaseStudy");
const Client = require("../models/Client");
const Career = require("../models/Career");
const Team = require("../models/Team");
const Faq = require("../models/Faq");
const NewsLetter = require("../models/Newsletter");
const NewsEvent = require("../models/NewsEvent");

const Category = require("../models/Category");
const Gallery = require("../models/Gallery");

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/uploads/");
  },
  filename: function (req, file, cb) {
    const originalname = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    const filename = `${originalname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

// const allowedimages = ["image/png", "image/jpeg", "image/jpg", "Image/webp", "image/aviff"]

// fileFilter: (req, file, cb) => {
//   if (file.mimetype in allowedimages ){
//   cb(null, true)
// }else{
//   cb(null, false)
//   return cb(new Error('Only images are allowed.'))
// }
// }

const maxSize = 3 * 1024 * 1024;
const upload = multer({ storage: storage, limits: { fileSize: maxSize } });
const single = multer().single("image");
const multiple = multer().array("images", 10);

var imageUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// Website Code

router.get("/", async (req, res) => {
  try {
    // Find the latest two blogs
    const clients = await Client.find()
    const news = await NewsEvent.find({ action: "Publish" })
      .sort({ createdAt: -1 })
      .limit(2);

    // Render the index page with the latest blogs
    res.render("index", { news, clients });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/about-us", async (req, res) => {
  res.render("about-us");
});

router.get("/products", async (req, res) => {
  res.render("products");
});

router.get("/products/:slug", async (req, res) => {
  const slug = req.params.slug;
  arr = [
    "armoring-plates",
    "backpacks-for-drones",
    "portable-armored-cabins",
    "secure-and-durable-carry-cases",
    "battery-warming-cases",
  ];
  if (arr.includes(slug)) {
    res.render(slug);
  } else {
    res.status(404).render("404");
  }
});

router.get("/services", async (req, res) => {
  res.render("services");
});

router.get("/services/:slug", async (req, res) => {
  const slug = req.params.slug;

  arr = [
    "technology-development",
    "technical-consultancy",
    "packaging-solutions",
    "manufacturing",
    "ai-ml-integration",
  ];
  if (arr.includes(slug)) {
    res.render(slug);
  } else {
    res.status(404).render("404");
  }
});

router.get("/news-and-events", async (req, res) => {
  try {
    const news = await NewsEvent.find({ action: "Publish" })

    res.render("news-and-events", { news });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/news-and-events/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    // Find the current blog by its slug
    const news = await NewsEvent.findOne({ slug: slug }).populate("author");

    arr = [];

    if (!news) {
      if (arr.includes(slug)) {
        return res.render(slug);
      }
      return res.status(404).render("404");
    }

    // Find related blogs by category (you can modify this based on your criteria)
    const relatedNews = await NewsEvent.find({
      category: news.category,
      slug: { $ne: news.slug },
    });

    res.render("news-and-events-detail", { news, relatedNews });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/industry", async (req, res) => {
  res.render("industries");
});

router.get("/contact", async (req, res) => {
  res.render("contact");
});

router.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find()

    res.render("clients", { clients });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/testimonial", async (req, res) => {
  res.render("testimonial");
});

router.get("/faqs", async (req, res) => {
  res.render("faq");
});

router.get("/terms-of-use", async (req, res) => {
  res.render("terms-of-use");
});

router.get("/privacy-policy", async (req, res) => {
  res.render("privacy-policy");
});

router.get("/careers", async (req, res) => {
  try {
    // Find the latest two blogs
    const careers = await Career.find({});

    // Render the index page with the latest blogs
    res.render("careers", { careers, careers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/careers/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    // Find the current blog by its slug
    const career = await Career.findOne({ slug: slug });

    if (!career) {
      return res.status(404).send("Career not found");
    }

    res.render("career-details", { career: career });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/blog", async (req, res) => {
  try {
    const blogs = await Blog.find({ action: "Publish" }).populate("author");

    res.render("blog", { blogs: blogs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/blog/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    // Find the current blog by its slug
    const blog = await Blog.findOne({ slug: slug }).populate("author");

    arr = [];

    if (!blog) {
      if (arr.includes(slug)) {
        return res.render(slug);
      }
      return res.status(404).send("Blog not found");
    }

    // Find related blogs by category (you can modify this based on your criteria)
    const relatedBlogs = await Blog.find({
      category: blog.category,
      slug: { $ne: blog.slug },
    });

    res.render("blog-details", { blog: blog, relatedBlogs: relatedBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//  Contacţ form
router.post("/contact-us", async (req, res) => {
  try {
    if (!req.body.token) {
      console.log("Token is undefined");
      res.status(400).send("Captcha is undefined!");
    }
    secretKey = process.env.RECAPTCHA_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.token}`;

    request(verifyUrl, (err, response, body) => {
      if (err) {
        console.log(err);
      }

      body = JSON.parse(body);
      if (!body.success && body.success === undefined) {
        res
          .status(400)
          .send(
            "Your Captcha Verification is failed. Please, call us on +91 79776 46886"
          );
      } else if (body.score < 0.6) {
        res
          .status(400)
          .send(
            "It seems like you are a bot and if we are mistaken. Please, call us on +91 79776 46886"
          );
      }

      const { name, email, phone, message } = req.body;
      const transporter = nodemailer.createTransport({
        service: "SMTP",
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL,
        to: ["saeed.lanjekar@gmail.com", "abdussalam@sovorun.com"],
        subject: "This message is from Maxbalk Website",
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res
            .status(400)
            .send(
              "Due to some reason the form wasn't submitted. Please, call us on +91 79776 46886"
            );
        } else {
          console.log("Email sent successfully");
          res
            .status(200)
            .send(
              "We have received your message and will get back to you as soon as possible."
            );
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("Message Sent Failed. Please, Try Again!");
  }
});

// Career Form start
router.post("/career-form", imageUpload, async (req, res) => {
  try {
    if (!req.body.token) {
      console.log("Token is undefined");
      res.status(400).send("Captcha is undefined!");
    }
    secretKey = process.env.RECAPTCHA_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.token}`;

    request(verifyUrl, (err, response, body) => {
      if (err) {
        console.log(err);
      }

      body = JSON.parse(body);
      if (!body.success && body.success === undefined) {
        res
          .status(400)
          .send(
            "Your Captcha Verification is failed. Please, call us on +91 79776 46886"
          );
      } else if (body.score < 0.6) {
        res
          .status(400)
          .send(
            "It seems like you are a bot and if we are mistaken. Please, call us on +91 79776 46886"
          );
      }

      const { name, email, phone, position, message } = req.body;
      const transporter = nodemailer.createTransport({
        service: "SMTP",
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL,
        to: [
          "saeed.lanjekar@gmail.com",
          "abdussalam@sovorun.com",
          "hr@gridfill.com",
        ],
        subject: `This message is from Maxbalk Website for ${position}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}\nPosition: ${position}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res
            .status(400)
            .send(
              "Due to some reason the form wasn't submitted. Please, call us on +91 79776 46886"
            );
        } else {
          console.log("Email sent successfully");
          res
            .status(200)
            .send(
              "We have received your application and will get back to you as soon as possible."
            );
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("Message Sent Failed. Please, Try Again!");
  }
});



// Admin Code Start

router.get("/admin", (req, res) => {
  res.redirect("/login");
});

// Register view
router.get("/register", (req, res) => {
  res.render("register", { message: null });
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, confirm_password } = req.body;
    if (password.length < 8) {
      res.status(500).json({
        error: "Password is too short, must be atleast of 8 characters.",
      });
    }
    if (password != confirm_password) {
      res
        .status(500)
        .json({ error: "Password & Confirm Password does not match." });
    }
    // Check if any user exists
    const count = await User.countDocuments({});
    const role = count === 0 ? "Admin" : "User";

    // Create a new user
    const user = new User({ name, email, phone, password, role });

    // Save the user to the database
    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login view
router.get("/login", (req, res) => {
  res.render("login", { message: null });
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Store user information in session
    req.session.user = {
      userId: user._id,
      role: user.role,
    };

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  // Clear the session data
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy session:", err);
    }
    // Redirect the user to the login page after logout
    res.redirect("/login");
  });
});

// Middleware to authenticate token
function authenticateUser(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}

// Middleware to authenticate admin user
function authenticateAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}

router.get("/dashboard", authenticateAdmin, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const user = await User.findOne({ _id: userId });
    const allModels = mongoose.modelNames();

    res.render("dashboard", { allModels, user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/list/:modelName", authenticateAdmin, async (req, res) => {
  const modelName = req.params.modelName;
  const userId = req.session.user.userId;
  const user = await User.findOne({ _id: userId });
  const allModels = mongoose.modelNames();
  try {
    // Retrieve all the data of the specified model from the database
    const Model = mongoose.model(modelName);
    const schema = Model.schema;
    const data = await Model.find();

    res.render("list", { modelName, data, user, schema, allModels, Model });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Update form route
router.get(
  "/list/:modelName/update/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { modelName, id } = req.params;
      const Model = mongoose.model(modelName);
      const document = await Model.findById(id);
      const userId = req.session.user.userId;
      const user = await User.findOne({ _id: userId });
      const allModels = mongoose.modelNames();
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const schema = Model.schema;

      const relatedSchemas = {}; // Store related schemas here

      // Retrieve related data
      const relatedFields = Object.values(schema.paths).filter(
        (field) => field.options.ref
      );

      for (const field of relatedFields) {
        relatedSchemas[field.options.ref] = await mongoose
          .model(field.options.ref)
          .find({});
      }

      res.render("update", {
        modelName,
        document,
        model: Model,
        mongoose,
        user,
        allModels,
        relatedSchemas,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update route
router.post(
  "/list/:modelName/update/:id",
  authenticateAdmin,
  imageUpload,
  async (req, res) => {
    const modelName = req.params.modelName;
    const id = req.params.id;
    // Find the model schema based on the modelName
    const Model = mongoose.model(modelName);
    try {
      // Find the document by its ID
      const document = await Model.findById(id);

      // Update the document fields based on the request body
      for (const field in req.body) {
        document[field] = req.body[field];
      }

      if (req.files) {
        if (req.files.image && req.files.image.length > 0) {
          const oldImagePath = document.image.replace(
            "/uploads/",
            "public/uploads/"
          );
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error(`Error deleting old image: ${err}`);
          }
          document.image = `/uploads/${req.files.image[0].filename}`;
        }
        if (req.files.banner && req.files.banner.length > 0) {
          const oldImagePath = document.banner.replace(
            "/uploads/",
            "public/uploads/"
          );
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error(`Error deleting old image: ${err}`);
          }
          document.banner = `/uploads/${req.files.banner[0].filename}`;
        }
        if (req.files.logo && req.files.logo.length > 0) {
          const oldImagePath = document.logo.replace(
            "/uploads/",
            "public/uploads/"
          );
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error(`Error deleting old image: ${err}`);
          }
          document.logo = `/uploads/${req.files.logo[0].filename}`;
        }
        if (req.files.images && req.files.images.length > 0) {
          document.images.forEach((oldImageUrl) => {
            // Extract the filename from the URL
            const oldImageFilename = oldImageUrl.split("/").pop();
            // Construct the path to the old image
            const oldImagePath = `public/uploads/${oldImageFilename}`;
            try {
              fs.unlinkSync(oldImagePath);
            } catch (err) {
              console.error(`Error deleting old image: ${err}`);
            }
          });
          const imageUrls = req.files.images.map(
            (file) => `/uploads/${file.filename}`
          );
          document.images = imageUrls;
        }
      }
      // Save the updated document
      await document.save();

      res.redirect(`/list/${modelName}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/list/:modelName/create", authenticateAdmin, async (req, res) => {
  const modelName = req.params.modelName;
  const model = mongoose.model(modelName);
  const schema = model.schema;
  const userId = req.session.user.userId;
  const user = await User.findOne({ _id: userId });
  const allModels = mongoose.modelNames();
  const relatedSchemas = {}; // Store related schemas here

  // Retrieve related data
  const relatedFields = Object.values(schema.paths).filter(
    (field) => field.options.ref
  );

  for (const field of relatedFields) {
    relatedSchemas[field.options.ref] = await mongoose
      .model(field.options.ref)
      .find({});
  }
  res.render("create", {
    modelName,
    schema,
    mongoose,
    user,
    allModels,
    relatedSchemas,
  });
});

// Define the POST route for creating a document
router.post(
  "/list/:modelName/create",
  authenticateAdmin,
  imageUpload,
  async (req, res) => {
    const modelName = req.params.modelName;
    const Model = mongoose.model(modelName);

    try {
      // Create a new document using the Model
      const document = new Model(req.body);

      if (req.files) {
        if (req.files.image) {
          document.image = `/uploads/${req.files.image[0].filename}`;
        }
        if (req.files.banner) {
          document.banner = `/uploads/${req.files.banner[0].filename}`;
        }
        if (req.files.logo) {
          document.logo = `/uploads/${req.files.logo[0].filename}`;
        }
        if (req.files.images) {
          const imageUrls = req.files.images.map(
            (file) => `/uploads/${file.filename}`
          );
          document.images = imageUrls;
        }
      }

      await document.save();

      res.redirect(`/list/${modelName}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while saving the document.");
    }
  }
);

// DELETE route for deleting a document by ID
router.get(
  "/list/:modelName/delete/:id",
  authenticateAdmin,
  async (req, res) => {
    const modelName = req.params.modelName;
    const id = req.params.id;

    try {
      // Find the model based on the provided modelName
      const model = mongoose.model(modelName);

      // Delete the document by ID
      await model.findByIdAndRemove(id);

      res.redirect(`/list/${modelName}`);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.get("/sitemap.xml", async (req, res) => {
  const baseUrl = "https://maxbalk.com"; // Change to your website's URL
  const urls = [
    "/about-us",
    "/contact",
    "/blog",
    "/careers",
    "/clients",
    "/testimonial",
    "/faqs",
    "/terms-of-use",
    "/privacy-policy",
    "/news-and-events",
    "/industry",
    "/products",
    "/products/technology-development",
    "/products/packaging-solutions",
    "/products/manufacturing",
    "/products/technical-consultancy",
    "/products/ai-ml-integration",
    "/services",
    "/services/armoring-plates",
    "/services/backpacks-for-drones",
    "/services/portable-armored-cabins",
    "/services/secure-and-durable-carry-case",
    "/services/battery-warming-cases",
  ];
  const blogs = await Blog.find({ action: "Publish" }, "slug").exec();

  for (const blog of blogs) {
    const blogSlug = `/blog/${blog.slug}`;
    urls.push(blogSlug);  
  }

  const news = await NewsEvent.find({ action: "Publish" }, "slug").exec();

  for (const n of news) {
    const newSlug = `/news-and-events/${n.slug}`;
    urls.push(newSlug);
  }
  const sitemap = create({ encoding: "UTF-8" }).ele("urlset", {
    xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
  });
  sitemap.ele("url").ele("loc").txt(baseUrl);
  for (const url of urls) {
    const pageUrl = `${baseUrl}${url}`;
    sitemap.ele("url").ele("loc").txt(pageUrl);
  }

  const sitemapXML = sitemap.end({ prettyPrint: true });

  // Save the sitemap to a file
  fs.writeFileSync("sitemap.xml", sitemapXML);

  res.set("Content-Type", "text/xml");
  res.send(sitemapXML);
});

module.exports = router;
