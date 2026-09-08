import express from 'express';
import cookieParser from 'cookie-parser';
import productRouter from './routes/product.js';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import wishlistRouter from './routes/wishlist.js';
import cartRouter from './routes/cart.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundMiddleware from './middlewares/notFound.js';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import cors from "cors";

const app = express();

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({extended: true}));


//Routes
app.get('/health', (req, res) => {
    res.status(200).json(
        {
            ok: true,
            data: "Server is up and running"
        }
    );
});

app.use('/api/product', productRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/cart', cartRouter);

//Swagger
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Not Found Middleware
app.use(notFoundMiddleware);
// Error Middleware
app.use(errorHandler);


export default app;
