import { Router, Response, Request } from "express";
import Stripe from "stripe";
import { config } from "../config/config";
import { updateSubscription } from "./usersRoute";

const paymentRoute = Router();

paymentRoute.post("/", (req: Request, res: Response) => {
  const stripe = new Stripe(config.stripe.SECRET_KEY!, {
    apiVersion: "2020-08-27",
  });

  const stripePayment = async () => {
    const { userId, stripeEmail, stripeToken } = req.body;
    const customer = await stripe.customers.create({
      email: stripeEmail,
      source: stripeToken,
      name: "Suleman Qaiser",
      description: "test customer",
    });

    const stripeCharge: any = await stripe.charges.create({
      amount: 1000,
      description: "Unlock NewsFeed",
      currency: "USD",
      customer: customer.id,
    });

    if (stripeCharge.failure_code === null) {
      await updateSubscription(userId);
      res.render("timeline.ejs", {
        userId: req.body.userId,
        accesstoken: req.body.accessToken,
      });
    } else {
      res.status(400).json({ message: `Payment failed to proceed` });
    }
  };

  try {
    stripePayment();
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export { paymentRoute };
