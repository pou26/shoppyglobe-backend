
import {createCart,updateCart,deleteCart} from "../Controller/cart.controller.mjs";

import {authenticatedUser,authorization} from "../Middleware/auth.js"

export function cartroutes(app) {

    //cart

    app.post("/cart/:userId", authenticatedUser, authorization, createCart);
    app.put("/cart/:cartid/:userId", authenticatedUser, authorization, updateCart);
    app.delete("/cart/:cartid/:userId", authenticatedUser, authorization, deleteCart);

}