import { prisma } from '../db/config.js';
import { selectAllProducts } from './product.js';

const insertItemToCart = async (userId, productId) => {
    try {
        let cart = await prisma.cart.findFirst(
            {
                select: { id: true },
                where: {
                    userId, status: 'ACTIVE' 
                }
            }
        );
        if (!cart) {
            cart = await prisma.cart.create({ data: {userId }});
        }
        const item = await prisma.cartItem.findFirst({select: {id: true}, where: {cartId: cart.id, productId}});
        if (item) {
            await prisma.cartItem.update(
                {
                    where: {id: item.id}, 
                    data: 
                    {
                        quantity: 
                        {
                            increment: 1
                        }
                    }
                }
            )
        } else {
            await prisma.cartItem.create(
                {
                    data: 
                    {
                        cartId: cart.id,
                        productId,
                        quantity: 1
                    }
                }
            )
        }
        return {
            ok: true
        }
    } catch (error) {
        return {
            ok: false
        }
    }
}

/* const getCartProducts = async (userId, db = prisma) => {
    try {
        const cart = await prisma.cart.findFirst({
            select: {id: true},
            where: {userId, status: 'ACTIVE'}
        })
        if (!cart) {
            throw new Error("Not found active cart");
        }
        const cartItems = await db.cartItem.findMany(
            {
                select: {id: true, productId: true, quantity: true },
                where: { cartId: cart.id }
            }
        )
        if (cartItems.length === 0) {
            return {
                ok: true,
                data: []
            }
        }
        //Search items info 
        const products = await selectAllProducts(cartItems.map(({productId}) => productId));
        if (!products.ok) {
            throw new Error("Not found products");
        }
        const response = products.data.map((product) => {
            const item = cartItems.find(item => item.productId === product.id);
            return {
                ...product, 
                quantity: item.quantity,
                subtotal: item.quantity * Number(product.price)
            }
        });
        return {
            ok: true,
            data: {
                cartId: cart.id,
                items: response
            }
        }
    } catch(error) {
        return {
            ok: false
        }
    }
} */

const getCartProducts = async (userId, db = prisma) => {
    try {
        const cart = await db.cart.findFirst({
            select: {
                id: true
            },
            where: {
                userId,
                status: 'ACTIVE'
            }
        });

        if (!cart) {
            return {
                ok: true,
                data: []
            };
        }

        const cartItems = await db.cartItem.findMany({
            select: {
                id: true,
                productId: true,
                quantity: true
            },
            where: {
                cartId: cart.id
            }
        });

        if (cartItems.length === 0) {
            return {
                ok: true,
                data: []
            };
        }

        const products = await selectAllProducts(
            cartItems.map(({ productId }) => productId),
            db
        );

        if (!products.ok) {
            throw new Error("Not found products");
        }

        const response = products.data.map((product) => {
            const item = cartItems.find(
                (item) => item.productId === product.id
            );

            return {
                ...product,
                quantity: item.quantity,
                subtotal:
                    item.quantity * Number(product.price)
            };
        });

        return {
            ok: true,
            data: {
                cartId: cart.id,
                items: response
            }
        };

    } catch (error) {
        return {
            ok: false
        };
    }
};

const createOrder = async (userId) => {
    try {
        return await prisma.$transaction(async (tx) => {

            const products = await getCartProducts(
                userId,
                tx
            );

            if (!products.ok) {
                throw new Error(
                    "Error getting cart"
                );
            }

            if (
                Array.isArray(products.data) ||
                products.data.items.length === 0
            ) {
                throw new Error(
                    "Not found items in the cart"
                );
            }

            const total =
                products.data.items.reduce(
                    (acc, product) => {
                        return (
                            acc +
                            product.subtotal
                        );
                    },
                    0
                );

            const order = await tx.order.create({
                data: {
                    userId,
                    total
                }
            });

            await tx.orderItem.createMany({
                data: products.data.items.map(
                    (product) => ({
                        orderId: order.id,
                        productId: product.id,
                        quantity:
                            product.quantity,
                        priceAtPurchase:
                            product.price
                    })
                )
            });

            await tx.cart.update({
                where: {
                    id: products.data.cartId
                },
                data: {
                    status: 'CHECKED_OUT'
                }
            });

            return {
                ok: true,
                data: {
                    orderId: order.id,
                    total
                }
            };
        });

    } catch (error) {
        return {
            ok: false,
            message: error.message
        };
    }
};

export {
    insertItemToCart,
    getCartProducts,
    createOrder
}