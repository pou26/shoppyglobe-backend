
import {getProduct,getProductById} from "../Controller/product.controller.mjs";


export function productroutes(app) {
    // Products

    app.get("/products",getProduct);
    app.get("/products/:productId", getProductById);

}