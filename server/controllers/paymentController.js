const stripe = require("../config/stripe");

const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; //pass the amount in body

    const paymentIntent = await stripe.paymentIntents.create({ //create the payment intent 
      amount: amount * 100, 
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret, //send the clientSecret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPaymentIntent };