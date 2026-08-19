import express from "express";
import type { Application } from "express";
import { specs } from "./config/swagger.js";
import swaggerUI from "swagger-ui-express"
import DBconfig from "./config/db.js";
import {router} from  "./routes/router.js";
const app: Application = express();
app.use(express.json());


//swagger
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs))
app.use('/', router)
//mongoDB
DBconfig();



app.listen(process.env.PORT ,()=>{
    console.log(`Server is running in port ${process.env.PORT}`)
})
app.use("/api/classes", router);

