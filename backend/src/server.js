import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'
import apiRoutes from "./routes/index.js";
import errorHandler from '../src/middlewares/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.use('/api', apiRoutes)
app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('Hello Trello')
})

const bootstrap = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected to MongoDB'))
        app.listen(PORT, () => {
            console.log(`Server started on: http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log(`Error connected to DB ${error.message}`)
    }
}

bootstrap()