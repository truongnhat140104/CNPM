import express from 'express';
import cors from 'cors';
import { connectDB } from "./config/db.js"
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';

//app config
const app = express();
const port = 3000;

//middlewares
app.use(express.json());
app.use(cors());

//db connect
connectDB();

//api endpoints
app.use("/api/food", foodRouter);
app.use('/images', express.static('uploads'));
app.use("/api/user",userRouter)

app.get('/', (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

//mongodb+srv://elvis140104_db_user:1234566@cluster1.mnnl32w.mongodb.net/?
//retryWrites=true&w=majority&appName=Cluster1
//elvis140104_db_user
//1234566