import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({
    // userId: {
    //     type: ObjectId,
    //     ref: 'user',
    //     required: true,
    //     unique: true
    // },
    items: [{
        productId: {
            type: ObjectId,
            ref: 'Product',
           
        },
        quantity: {
            type: Number,
            
        },
    }],
    totalPrice: {
        type: Number,

    },
    totalItems: {
        type: Number,
                
    }
}, { timestamps: true })

const Cart =  mongoose.model("cart",cartSchema)

export default Cart;
