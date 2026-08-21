import express from "express";
import type { Application } from "express";
import { specs } from "./config/swagger.js";
import swaggerUI from "swagger-ui-express"
import DBconfig from "./config/db.js";
import {router} from  "./routes/router.js";
import cookieParser from "cookie-parser";


const app: Application = express();
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(cookieParser());

//swagger
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs))
app.use('/gym', router)
//mongoDB
DBconfig();
//Cookie


app.listen(port ,()=>{
    console.log(`Server is running in port ${port}`)
})


