import Cart from "../Model/cart.model.mjs";
import Product from "../Model/product.model.mjs";
import {isValidObjectId} from "../Middleware/validate.mjs"; 

// ✅ Create or Update Cart Function
export async function createCart(req, res, next) {
    try {
        const { userId } = req.params; // Get user ID from params
        const { productId, quantity = 1, cartId } = req.body; // Default quantity to 1 if not provided

        if (!isValidObjectId(productId)) {
            return res.status(400).json({ msg: "Invalid product ID" });
        }

        // 🔍 Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: false, message: "No product found" });
        }

        let cart;
        if (cartId) {
            cart = await Cart.findById(cartId);
            if (!cart) {
                return res.status(404).json({ status: false, message: "Cart not found" });
            }
        } else {
            // Check if the user already has a cart
            cart = await Cart.findOne({ userId });
        }

        if (cart) {
            // 🔍 Check if product already exists in the cart
            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }

            // Update cart total price and item count
            cart.totalPrice += product.price * quantity;
            cart.totalItems = cart.items.length;

            await cart.save();
            return res.status(201).json({ status: true, message: "Cart updated successfully", data: cart });
        }

        // If no cart exists, create a new one
        const newCart = await Cart.create({
            userId,
            items: [{ productId, quantity }],
            totalPrice: product.price * quantity,
            totalItems: 1,
        });

        return res.status(201).json({ status: true, message: "New cart created successfully", data: newCart });

    } catch (error) {
        next(error);
    }
}

export async function updateCart(req, res, next) {
    try {
        const { cartid } = req.params;
        const { productId, quantity } = req.body;

        if (!isValidObjectId(cartid)) {
            return res.status(400).json({ msg: "Invalid cart ID" });
        }

        // 🔍 Check if cart exists
        const cart = await Cart.findById(cartid);
        if (!cart) {
            return res.status(404).json({ status: false, message: "Cart not found" });
        }

        // 🔍 Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }

        // 🔍 Check if the product is already in the cart
        const cartItem = cart.items.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ status: false, message: "Product not found in cart" });
        }

        let updatedCart;
        if (quantity > 0) {
            // ✅ Update quantity of an existing product
            updatedCart = await Cart.findOneAndUpdate(
                { _id: cartid, "items.productId": productId },
                {
                    $set: { "items.$.quantity": quantity },
                    $inc: { totalPrice: (quantity - cartItem.quantity) * product.price }
                },
                { new: true }
            );
        } else {
            // ✅ Remove product from cart if quantity is 0
            updatedCart = await Cart.findOneAndUpdate(
                { _id: cartid },
                {
                    $pull: { items: { productId: productId } },
                    $inc: { totalPrice: -(cartItem.quantity * product.price) }
                },
                { new: true }
            );
        }

        // 🔄 Update totalItems count
        updatedCart.totalItems = updatedCart.items.length;
        await updatedCart.save();

        return res.json({ status: true, message: "Cart updated successfully", data: updatedCart });
    } catch (error) {
        next(error);
    }
}


export async function deleteCart(req, res, next) {
    try {
        const { cartid } = req.params;
        const { productId, quantityToRemove } = req.body; // Quantity to remove from the cart

        // 🔍 Validate cart ID
        if (!isValidObjectId(cartid)) {
            return res.status(400).json({ status: false, message: "Invalid cart ID" });
        }

        // 🔍 Validate product ID
        if (!isValidObjectId(productId)) {
            return res.status(400).json({ status: false, message: "Invalid product ID" });
        }

        // 🔍 Validate quantityToRemove (ensure it's a valid number)
        if (isNaN(quantityToRemove) || quantityToRemove <= 0) {
            return res.status(400).json({ status: false, message: "Invalid quantity to remove. It should be a positive number." });
        }

        // 🔍 Check if cart exists
        const cart = await Cart.findById(cartid);
        if (!cart) {
            return res.status(404).json({ status: false, message: "Cart not found" });
        }

        // 🔍 Check if the product exists in the cart
        const cartItem = cart.items.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ status: false, message: "Product not found in cart" });
        }

        // 🔍 Fetch product price from the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found in database" });
        }

        // 🔍 Check if quantity to remove is greater than or equal to cart quantity
        if (cartItem.quantity <= quantityToRemove) {
            // If quantity to remove is equal to or greater than quantity in cart, remove product completely
            const updatedCart = await Cart.findByIdAndUpdate(
                cartid,
                {
                    $pull: { items: { productId: productId } }, // Remove product from cart
                    $inc: { totalPrice: -(cartItem.quantity * product.price) } // Update total price
                },
                { new: true }
            );
            updatedCart.totalItems = updatedCart.items.length;
            await updatedCart.save();
            return res.status(200).json({ status: true, message: "Product removed from cart successfully", data: updatedCart });
        }

        // If quantity to remove is less than cart quantity, just decrease the quantity
        cartItem.quantity -= quantityToRemove;

        // Update cart total price
        cart.totalPrice -= quantityToRemove * product.price;

        // Ensure totalPrice is a valid number (this will prevent NaN errors)
        if (isNaN(cart.totalPrice)) {
            return res.status(400).json({ status: false, message: "Invalid total price calculation" });
        }

        await cart.save();

        return res.status(200).json({ status: true, message: "Product quantity updated successfully", data: cart });
    } catch (error) {
        next(error);
    }
}
