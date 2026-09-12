/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart operations
 * /api/cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add an item to cart
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       201:
 *         description: Item added to cart
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get cart details
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 * /api/cart/checkout:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Checkout the cart
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Checkout processed
 */
import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import { addItemToCart, infoCart, checkoutCart, confirmCheckout } from '../controllers/cart.js';


const router = express.Router();

router.post('/', authenticate, addItemToCart);
router.get('/', authenticate, infoCart);
router.post('/checkout', authenticate, checkoutCart);
router.post("/checkout/confirm", authenticate, confirmCheckout);

export default router;

