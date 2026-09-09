/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Product management
 * /api/product:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create a new product
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       201:
 *         description: Product created
 *       403:
 *         description: Forbidden
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 * /api/product/{id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   put:
 *     tags:
 *       - Product
 *     summary: Update a product
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       200:
 *         description: Product updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete a product
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       403:
 *         description: Forbidden
 */
import express from 'express';
import { createProduct, getAllProducts, getProductById, updateInfoProduct, removeProduct } from '../controllers/product.js';
import validateProductsMiddleware from '../middlewares/validateProduct.js';
import authenticate from '../middlewares/authenticate.js';
import reviewRouter from './review.js';
import requireRole from '../middlewares/requireRole.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/', authenticate, requireRole('ADMIN'), upload.single('image'), validateProductsMiddleware,createProduct);
router.get('/', getAllProducts);
router.delete('/:id', authenticate, requireRole('ADMIN'), removeProduct);
router.put('/:id', authenticate, requireRole('ADMIN'), upload.single('image'), updateInfoProduct);
router.get('/:id', getProductById);
//reviews routes
router.use('/:productId/reviews', authenticate, reviewRouter);

export default router;