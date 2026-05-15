require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running!");
});

app.post("/send-reminder", async (req, res) => {
  const { customer, email, amount } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "shivi.giggles1@gmail.comm",
      to: email,
      subject: "Payment Reminder",
      html: `
        <h2>Payment Reminder</h2>
        <p>Hello ${customer},</p>
        <p>This is a reminder that your payment of <b>₹${amount}</b> is still pending.</p>
        <p>Please complete the payment soon.</p>
      `,
    });

    res.status(200).json({
      message: "Reminder email sent!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Email failed",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});