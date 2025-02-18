import { createUser, loginUser} from "../Controller/user.controller.mjs";
import {getProduct,getProductById} from "../Controller/product.controller.mjs";
import {createCart,updateCart,deleteCart} from "../Controller/cart.controller.mjs";

import { validateUser,validateUpdateUser  } from "../Middleware/validate.mjs";

import {authenticatedUser,authorization} from "../Middleware/auth.js"

export function userroutes(app) {
    app.post("/user", validateUser, createUser);
    app.post("/login",loginUser);


}
