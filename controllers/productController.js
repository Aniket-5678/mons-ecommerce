import slugify from "slugify";
import productModel from "../models/product.model.js";
import categoryModel from "../models/category.model.js"
import orderModel from "../models/order.model.js";
import fs from "fs"
import braintree from "braintree";
import dotenv from "dotenv"

dotenv.config()


//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

// create-product controller

export const createProductController = async (req, res) => {
    try {

        const { name, slug, description, price, quantity, category, shipping } = req.fields
        const { photo } = req.files

        //validation 
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" })
            case !description:
                return res.status(500).send({ error: "Description is Required" })
            case !price:
                return res.status(500).send({ error: "price is Required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" })
            case !category:
                return res.status(500).send({ error: "category is Required" })
            case photo && photo.size > 100000:
                return res.status(500).send({ error: "Photo  is Required" })


        }

        const products = new productModel({...req.fields, slug: slugify(name)})

        if (photo) {
            products.photo.data= fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(200).send({
            success: true,
            message: "product created successfully",
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error in creating product"
        })
    }



}


// get all product controller

export const getProductController = async(req, res) => {
try {
    const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt: -1})
    res.status(200).send({
        success: true,
        totalCount: products.length,
        message: "All products",
        products
    })



} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "error in getting product",
        error: error.message
    })
}

}

// get-single product controller

export const getSingleProductController = async(req ,res) => {

try {
     
const products = await productModel.findOne({slug: req.params.slug}).select("-photo").populate('category')

res.status(200).send({
    success: true,
    message: "single product Fetched",
    products
})

} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "error while getting single product",
        error: error.message
    })
}

}

export const productPhotoController = async(req ,res) => {
    try {
        
        const products = await productModel.findById(req.params.pid).populate('category')
        if (products.photo.data) {
              res.set("Content-type", products.photo.contentType)
              return res.status(200).send(products.photo.data)
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error while getting product photo",
            error: error.message
        })
    }
}


// delete-product controller

export const  deleteProductController = async(req, res) => {
 
    try {
        
   await productModel.findByIdAndDelete(req.params.pid).select("-photo")
   res.status(200).send({
    success: true,
    message: "product deleted successfully"
   })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error while deleting product",
            error
        })
    }


}

// update-product controller

export const updateProductController = async(req, res) => {
 
    try {

        const { name, slug, description, price, quantity, category, shipping } = req.fields
        const { photo } = req.files

        //validation 
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" })
            case !description:
                return res.status(500).send({ error: "Description is Required" })
            case !price:
                return res.status(500).send({ error: "price is Required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" })
            case !category:
                return res.status(500).send({ error: "category is Required" })
            case photo && photo.size > 100000:
                return res.status(500).send({ error: "Photo  is Required" })


        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug: slugify(name)}, {new: true})

        if (photo) {
            products.photo.data= fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(200).send({
            success: true,
            message: "product created successfully",
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error in creating product"
        })
    }

}


//filters
export const productFilterController = async(req ,res) => {

try {
    const {checked, radio} = req.body
    let args = {}
    if(checked.length > 0) args.category = checked
    if(radio.length) args.price = {$gte: radio[0]  ,$lte: radio[1]}
    const products = await productModel.find(args)
    res.status(200).send({
        success: true,
        products
    })
} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: "error while filtering products"
    })
}


}


//product-count controller

export const productCountController = async(req,res) => {
    try {
        const  total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            message: "product count successfully",
            total
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while getting product count",
            error
        })
    }
}



// product per page

export const productPerpageController = async(req,res) => {

    try {
        const perpage = 6
        const page =  req.params.page ? req.params.page : 1
       const  products = await productModel.find({}).select("-photo").skip((page-1) * perpage).limit(perpage).sort({createdAt: -1})
       res.status(200).send({
        success: true,
        products
       })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in perpage count",
            error
        })
    }
}


//search product controller

export const searchProductController = async(req,res) => {
    try {
    
   const {keyword} = req.params
   const results = await productModel.find({
    $or: [
        {name: {$regex: keyword, $options: "i"}},
        {description: {$regex: keyword, $options: "i"}}
    ],
   }).select("-photo")
   res.json(results)

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message: "error in search product",
            error
        })
    }
}


//similiar product controller
export const relatedProductController = async(req, res)=> {

    try {
         const {pid, cid} = req.params
         const products = await productModel.find({
            category: cid,
            _id:{$ne: pid}

         }).select("-photo").limit(3).populate("category")
         res.status(200).send({
            success: true,
            products
         })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "erorr while getting similar product",
            error
        })
    }
}


//product-category controller

export const productCategoryController = async(req, res) => {
    try {
        const category = await categoryModel.findOne({slug: req.params.slug})
        const products = await productModel.find({category}).populate("category")
        res.status(200).send({
            success:true,
            category,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message: "error while getting category wise product",
            error
        })
    }
}


//payment gateway api controller

export const braintreeTokenController = async(req,res) => {

    try {
        gateway.clientToken.generate({}, function(err, response){
       if(err){
        res.status(500).send(err)
       }else{
        res.send(response)
       }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in payment gateway integration",
            error
        })
    }
}



export const  braintreePaymentController = async(req, res) => {
try {
    const {cart, nonce} = req.body;
    let total = 0
     cart.map((i)=> {total  += i.price})
     let newTranaction =  gateway.transaction.sale({
        amount: total,
        paymentMethodNonce: nonce,
        options: {
            submitForSettlement: true
        }

     },
     function(error, result){
        if (result) {
            const order = new orderModel({
                products: cart,
                payment: result,
                buyer: req.user._id
            }).save()
            res.json({ok: true })
        }else{
            res.status(500).send(error)
        }
     }
     )

} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message: "error in payment",
        error
    })
}
}


