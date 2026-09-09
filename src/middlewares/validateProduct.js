import CError, {Selector} from "../misc/errors.js"
const validateProductsMiddleware = (req, res, next) => {
    const product = JSON.parse(req.body.product);
    const { name, price, stock } = product;
    if (!name || price === null || stock === null || price <= 0 || stock <= 0) {
        return next(new CError(Selector.BAD_INPUT));
    }
    next();
}

export default validateProductsMiddleware;