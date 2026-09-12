import stripe from "../config/stripe.js";
import { getCartProducts } from "./cart.js";

const createCheckoutSession = async (userId) => {
  try {
    const cart = await getCartProducts(userId);

    if (!cart.ok) {
      throw new Error("Could not get cart");
    }

    if (
      Array.isArray(cart.data) ||
      cart.data.items.length === 0
    ) {
      throw new Error("Cart is empty");
    }

    const lineItems = cart.data.items.map(
      (product) => ({
        price_data: {
          currency: "pen",

          product_data: {
            name: product.name,
          },

          unit_amount: Math.round(
            Number(product.price) * 100
          ),
        },

        quantity: product.quantity,
      })
    );

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card"],

        mode: "payment",

        line_items: lineItems,

        success_url:
          `${process.env.URL_FRONTEND}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.URL_FRONTEND}/cart`,

        metadata: {
          userId,
          cartId: cart.data.cartId,
        },
      });

    return {
      ok: true,

      data: {
        url: session.url,
        sessionId: session.id,
      },
    };

  } catch (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
};

const confirmCheckoutSession = async (
  sessionId,
  userId
) => {
  try {
    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId
      );

    if (session.payment_status !== "paid") {
      return {
        ok: false,
        message: "Payment has not been completed"
      };
    }

    if (session.metadata?.userId !== userId) {
      return {
        ok: false,
        message: "Invalid payment session"
      };
    }

    return {
      ok: true,
      data: session
    };

  } catch (error) {
    return {
      ok: false,
      message: error.message
    };
  }
};

export {
  createCheckoutSession,
  confirmCheckoutSession
};