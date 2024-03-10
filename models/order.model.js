import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({

products: [{
    type: mongoose.ObjectId,
    ref: 'Products'
}],

payment: {},

buyer: {
    type: mongoose.ObjectId,
    ref: 'Users'
},
status: {
    type: String,
    default: "Not process",
    enum: ["Not process", "processing", 'shipping', "deliverd", "cancel"]
}

},{timestamps: true})


export default mongoose.model("Orders", orderSchema)