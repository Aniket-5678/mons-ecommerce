import categoryModel from "../models/category.model.js";
import slugify from "slugify";


export const  createCategoryController = async(req, res) => {

try {
    
  const {name} = req.body

  //validation
  if (!name) {
     return res.status(401).send({
        message: "Name is Required"
     })
  }

  const existingCategory = await categoryModel.findOne({name})

  if (existingCategory) {
    return res.status(200).send({
        success:true,
        message: "Category already exists"
    })
  }

  const category = await new categoryModel({
    name,
     slug: slugify(name)
  }).save()
  res.status(201).send({
   success:true,
   message: " new categroy created  successfully",
   category
  })

} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        error,
        message: "error while creating a category"
    })
}


}


export const updateCategoryController = async(req ,res) => {
  
try {
    const {name} = req.body
    const {id} = req.params

    const category = await categoryModel.findByIdAndUpdate(id,{name, slug:slugify(name)}, {new: true})
    res.status(200).send({
        success: true,
        message: "category updated successfully",
        category
    })

} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        error,
        message: "error while updating category"
    })
}

}


// get All category controller

export const categoryController = async(req, res) => {

    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success:true,
            message: "All categories  list",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error while getting All categories"
        })
    }
}


//single category controller

export const singleCategoryController = async(req, res) => {

try {
  
    const category = await categoryModel.findOne({slug: req.params.slug})
  res.status(200).send({
    success: true,
    message: "get single category successfully",
    category
  })


} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        error,
        message: "error while getting single category"
    })
}

}

// delete category controller

export const  deleteCategoryController = async(req, res) => {

try {
      
const {id} = req.params
await categoryModel.findByIdAndDelete(id)

res.status(200).send({
    success: true,
    message: "category deleted successfully"
})

} catch (error) {
    console.log(error);
   res.status(500).send({
    success: false,
    message: "error while deleting category",
    error
   })

}

}