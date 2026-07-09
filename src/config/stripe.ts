import Stripe from "stripe";
import config from "./index";


export const stripe : Stripe = new Stripe(config.stripe.secretKey);