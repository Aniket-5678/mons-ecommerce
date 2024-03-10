import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectionDB from "./db/db.js"
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//dotenv
dotenv.config()


//mongodb connection
connectionDB()

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, './client/build')))

app.use('/api/v1/auth', authRoutes )
app.use('/api/v1/category', categoryRoutes )
app.use('/api/v1/product', productRoutes)

app.use('*', function(req, res){
    res.sendFile(path.join(__dirname, './client/build/index.html'))
    })


app.listen(process.env.PORT,   ()=> {
    console.log(`server is running on port ${process.env.PORT}`);
})