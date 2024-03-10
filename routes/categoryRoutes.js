import express from "express"
import {isAdmin, requireSignIn}  from  "../middlewear/authmiddlewear.js"
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/createCategoryController.js"

const router = express.Router()

//routes
//create-category Routes
router.post('/create-category', requireSignIn, isAdmin , createCategoryController)

//update-category Routes
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

//get-All category Routes
router.get('/get-category', categoryController)

// single-category Routes
router.get('/single-category/:slug', singleCategoryController)

//delte-category Routes
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)

export default router