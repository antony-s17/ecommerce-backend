import { prisma } from '../db/config.js';
import { cleanData } from '../utils/utils.js';
import CError, { Selector } from '../misc/errors.js';
import cloudinary from '../config/cloudinary.js';

const attributes = ['id', 'createdAt', 'updatedAt'];

const insertProduct = async (product, file) => {
    try {
        if (file) {
            const result = await uploadImage(file);
            product.imageUrl = result.secure_url;
        }
        const response = await prisma.product.create({ data: product });
        return {
            ok: true,
            data: cleanData(...attributes)(response)
        }  
    } catch (error) {
        return {
            ok: false
        }
    } 
}

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'products'
            },
            (error, result) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        stream.end(file.buffer);
    });
};

/* const selectAllProducts = async (productId) => {
    try {
        const response = await prisma.product.findMany({ select: { id: true,name: true, price: true }, where: {id: { in: productId }}});
        return {
            ok: true,
            data: response
        }
    } catch (error) {
        return {
            ok: false,
            data: []
        }
    }
}  */

const selectAllProducts = async (productIds, db = prisma) => {
    try {
        const response = await db.product.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                imageUrl: true
            },
            where: productIds
                ? {
                    id: {
                        in: productIds
                    }
                }
                : undefined
        });

        return {
            ok: true,
            data: response
        };

    } catch (error) {
        return {
            ok: false,
            data: []
        };
    }
};

const selectProductById = async (id) => {
    try {
        const response = await prisma.product.findUnique({ where: {id: id }})
        if (!response) {
            throw new CError("Product not found");
        }
        return {
            ok: true,
            data: cleanData(...attributes)(response)
        }
    } catch (error) {
        return {
            ok: false,
            data: {}
        }
    }
}

const updateProduct = async (id, data, file) => {
    try {
        if (file) {
            const result = await uploadImage(file);
            data.imageUrl = result.secure_url;
        }
        const productUpdate = await prisma.product.update({ where: { id } , data});
        return {
            ok: true,
            data: cleanData(...attributes)(productUpdate)
        }
    } catch (error) {
        return {
            ok: false,
            data: error.code
        }
    }
}

const deleteProduct = async (id) => {
    try {
        await prisma.product.delete({where: { id }});
        return {
            ok: true
        }
    } catch (error) {
        return {
            ok: false,
            data: error.code
        }
    }
}

export {
    insertProduct,
    selectAllProducts,
    selectProductById,
    updateProduct,
    deleteProduct
}