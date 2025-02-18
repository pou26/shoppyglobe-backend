import { createUser, loginUser} from "../Controller/user.controller.mjs";
import {getProduct,getProductById} from "../Controller/product.controller.mjs";
import {createCart,updateCart,deleteCart} from "../Controller/cart.controller.mjs";

import { validateUser,validateUpdateUser  } from "../Middleware/validate.mjs";

import {authenticatedUser,authorization} from "../Middleware/auth.js"

export function routes(app) {
    app.post("/user", validateUser, createUser);
    app.post("/login",loginUser);


    // Products

    app.get("/products",getProduct);
    app.get("/products/:productId", getProductById);

    //cart

    app.post("/cart/:userId", authenticatedUser, authorization, createCart);
    app.put("/cart/:cartid/:userId", authenticatedUser, authorization, updateCart);
    app.delete("/cart/:cartid/:userId", authenticatedUser, authorization, deleteCart);
}
