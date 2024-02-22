require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nodemailer = require('nodemailer');

const app = express();

const PORT = process.env.PORT || 3000;

const db = process.env.MONGODB_URL

// Connect to MongoDB
mongoose.connect(db, {
  useNewUrlParser: true
}).then(() => console.log("Database Connected"));


// Routes
const routes = require("./routes/main")
const NewsLetter = require('./models/Newsletter')

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(__dirname + '/assets'));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: db }),
}));

app.use('', routes)

// Contact Form start

app.post('/contact-us', async (req, res) => {
    const { name, email, phone, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'SMTP',
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.GMAIL,
        to: ["abdussalam@sovorun.com", "saeed.lanjekar@gmail.com"],
        subject: email,
        text: `This message is from Vertilink Elevators Website\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nmessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);

        } else {
            console.log('Email sent successfully');
            res.redirect('/');
        }
    });
});
// Contact Form

app.get('*', async (req, res) => {
    res.render('404');
});

// Start the server
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`)); 