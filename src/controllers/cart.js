import { isValidUUID } from "../utils/utils.js";
import CError, { Selector } from "../misc/errors.js";
import { getCartProducts, insertItemToCart, createOrder } from "../services/cart.js";
import { createCheckoutSession, confirmCheckoutSession } from "../services/stripe.js";

const addItemToCart = async (req, res, next) => {
    const { id: userId } = res.locals;
    const { productId } = req.body;
    if (
        !isValidUUID(userId) ||
        !isValidUUID(productId)
    ) {
        return next(new CError(Selector.BAD_INPUT));
    }
    const response =await insertItemToCart(userId,productId);
    if (!response.ok) {
        return next(new CError(Selector.BAD_ERROR));
    }
    return res.status(201).json({
        ok: true,
        data: "Product added to cart"
    });
};


const infoCart = async (req, res, next) => {
    const { id: userId } = res.locals;
    if (!isValidUUID(userId)) {
        return next(new CError(Selector.BAD_INPUT));
    }
    const response = await getCartProducts(userId);
    if (!response.ok) {
        return next(new CError(Selector.BAD_ERROR)
        );
    }
    return res.status(200).json({
        ok: true,
        data: response.data
    });
};


const checkoutCart = async (req, res, next) => {
    const { id: userId } = res.locals;
    if (!isValidUUID(userId)) {
        return next(new CError(Selector.BAD_INPUT));
    }
    const response = await createCheckoutSession(userId);
    if (!response.ok) {
        return next(new CError(Selector.BAD_ERROR));
    }

    return res.status(200).json({
        ok: true,
        data: response.data
    });
};

const confirmCheckout = async (req, res, next) => {
  const { id: userId } = res.locals;
  const { sessionId } = req.body;

  if (!isValidUUID(userId) || !sessionId) {
    return next(new CError(Selector.BAD_INPUT));
  }

  const payment = await confirmCheckoutSession(sessionId,userId);

  if (!payment.ok) {
    return next(new CError(Selector.BAD_ERROR));
  }

  const order =
    await createOrder(userId);

  if (!order.ok) {
    return next(new CError(Selector.BAD_ERROR));
  }

  return res.status(200).json({
    ok: true,
    data: order.data,
  });
};


export {
    addItemToCart,
    infoCart,
    checkoutCart,
    confirmCheckout
};