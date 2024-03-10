import express from "express"
import {isAdmin, requireSignIn} from "../middlewear/authmiddlewear.js"
import { braintreePaymentController, braintreeTokenController, createProductController,  deleteProductController,   getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productPerpageController, productPhotoController,  relatedProductController,  searchProductController,  updateProductController } from "../controllers/productController.js"
import formidable from "express-formidable"


const router = express.Router()


//Product Routes

router.post('/create-product', requireSignIn, isAdmin , formidable(), createProductController )

router.put('/update-product/:pid', requireSignIn, isAdmin , formidable(), updateProductController)

router.get('/get-product', getProductController)

router.get('/get-product/:slug', getSingleProductController)

router.get('/product-photo/:pid',  productPhotoController)

router.delete('/delete-product/:pid', deleteProductController)


// filter product Routes
router.post('/product-filters', productFilterController)

//product counts
router.get('/product-count', productCountController)

//perpage 
router.get('/product-list/:page', productPerpageController)

//search product Routes
router.get('/search/:keyword', searchProductController)

//similar product Routes
router.get('/related-product/:pid/:cid', relatedProductController)

// category wise product Routes
router.get('/product-category/:slug', productCategoryController)

//payment gateway routes
router.get('/braintree/token', braintreeTokenController)

router.post('/braintree/payment', requireSignIn, braintreePaymentController)




export default router

