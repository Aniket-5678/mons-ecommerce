import { comparePassword, hashedPassword } from "../helper/authhelper.js"
import userModel from "../models/user.model.js"
import JWT from "jsonwebtoken"
import orderModel from "../models/order.model.js"

export const registerController = async(req, res) => {

try {
     const {name, email, password,  address, phone } = req.body
      
     //validation
     if (!name) {
        return res.status(400).send({
          success: false,
          message: "name is Required"
        })
     }
     if (!email) {
      return res.status(400).send({
        success: false,
        message: "email is Required"
      })
   }
   if (!password) {
    return res.status(400).send({
      success: false,
      message: "password is Required"
    })
 }
 if (!address) {
  return res.status(400).send({
    success: false,
    message: "Address is Required"
  })
}
if (!phone) {
  return res.status(400).send({
    success: false,
    message: "Phone is Required"
  })
}

 const existeduser =  await userModel.findOne({email})
 if (existeduser) {
   return res.status(400).send({
    success: false,
    message: "user already exist"
   })
 } 

   const hashed = await hashedPassword(password)

 const user = await new userModel({
  name: name,
  email: email,
  password: hashed,
  phone: phone,
  address: address
 })
.save()
res.status(200).send({
  success: true,
  message: "Registeration successfull",
  user
})

 

} catch (error) {
    console.log(error);
  res.status(500).send({
    success: false,
    message: "error in registeration"
})

}

}

export const loginController = async(req, res) => {
 try {
    
  const {email, password} = req.body
 //validation
  if (!email || !password) {
     return res.status(400).send({
      success: false,
      message: "invalid email or password"
     })
  }
  const user = await userModel.findOne({email})
  if (!user) {
     return res.status(404).send({
       success: false,
       message: "email is not Registerd"
     })
  }
 
   const match =   await comparePassword(password, user.password)
  if (!match) {
      return res.status(400).send({
        success: false,
        message: "invalid password"
      })
  }
    

  const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"} )

  res.status(200).send({
    success: true,
    message: "login successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  })


 } catch (error) {
  console.log(error);
  res.status(500).send({
    success: false,
    message: "error in login"
})

 }

}


//forget password controller
export const forgetController = async(req, res) => {
 try {
   const {email, newpassword} = req.body

   //validation
   if (!email) {
     return res.status(400).send({message: "email is Required"})
   }
   if (!newpassword) {
    return res.status(400).send({message: "new Password is Required"})
  }
   //check
   const user = await userModel.findOne({email})
   if (!user) {
      return res.status(400).send({
        success:false,
        message: "wrong  email "
      })
   }
    
   const hash = await hashedPassword(newpassword)
   await userModel.findByIdAndUpdate(user._id, {password: hash})
   res.status(200).send({
    success: true,
    message: " Password Reset successfully"
   })
   
 } catch (error) {
  console.log(error);
  res.status(500).send({
    success: false,
    message: "error in Reset password"
  })
 }


}

//test controller

  export const testController = async(req ,res) => {

  res.send("protected Routes")

}


// update profile controller

export const updateProfileController = async(req ,res) => {

  try {
    const {name, email, password, address, phone} = req.body
   const user = await userModel.findById(req.user._id)
      
    if (password && password.length < 6) {
       return   res.json({error: "password is require and atleast 6 charachter long"})
    }
      const hash =  password ? await hashedPassword(password) : undefined
     const updateduser = await userModel.findByIdAndUpdate(req.user._id, {

      name: name || user.name,
      email: email || user.email,
      password: hash || user.password,
      phone: phone || user.phone,
      address: address || user.address

     }, {new: true})
     res.status(200).send({
      success: true,
      message: "profile updated successfully",
      updateduser
     })
     
     


  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message: "error while updating user profile",
      error
    })
  }
}

// orders

export const getOrdersController = async(req, res) => {

  try {
       const  orders = await orderModel.find({buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
       res.json(orders)
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "error in getting orders ",
          error
      })
  }
  
  } 

  export const  getAllOrderscontroller = async(req, res) => {

    try {
         const  orders = await orderModel.find({})
         .populate("products", "-photo")
         .populate("buyer", "name")
         .sort({createdAt: -1})
         res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in getting Allorders ",
            error
        })
    }
    
    } 


//order-status

export const  orderStatusController = async(req, res)=> {
 try {
    const {orderId} = req.params
    const {status} = req.body
    const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new: true})
  res.json(orders)
 } catch (error) {
  console.log(error);
  res.status(500).send({
    success:false,
    message: "error while updating order status"
  })
 }
}