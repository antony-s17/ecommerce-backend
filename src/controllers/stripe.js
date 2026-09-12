import CError, { Selector } from "../misc/errors.js";

import { createCheckoutSession } from "../services/stripe.js";

const createStripeCheckout = async (
  req,
  res,
  next
) => {
  const { id: userId } = res.locals;

  const response =
    await createCheckoutSession(userId);

  if (!response.ok) {
    return next(
      new CError(Selector.BAD_ERROR)
    );
  }

  return res.status(200).json({
    ok: true,
    data: response.data,
  });
};

export {
  createStripeCheckout,
};