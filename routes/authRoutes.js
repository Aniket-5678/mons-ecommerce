import express from "express"
import { forgetController, getAllOrderscontroller, getOrdersController, loginController, orderStatusController, registerController, testController, updateProfileController } from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewear/authmiddlewear.js"




const router = express.Router()

router.post('/register', registerController)

router.post('/login', loginController)

//forget password 
router.post('/forget-password', forgetController)

//test routes
router.get('/test', requireSignIn, isAdmin,  testController)

//protected user auth Routes
router.get('/user-auth', requireSignIn, (req, res)=> {
  res.status(200).send({ok: true})
})

//protected admin auth Routes
router.get('/admin-auth', requireSignIn, isAdmin, (req, res)=> {
  res.status(200).send({ok: true})
})

//update profile Routes
router.put('/profile', requireSignIn, updateProfileController)



//orders 
router.get('/order' , requireSignIn , getOrdersController)


//All-orders
router.get('/all-order', requireSignIn, isAdmin, getAllOrderscontroller)

//order-status
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

export default router