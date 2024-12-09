import dotenv from 'dotenv'
dotenv.config()

import {conectarDB} from './config/db'
import express from 'express'
import router from './router'
import cors from 'cors'
import { corsConfig } from './config/cors'

const app = express()


// habilitamos cors
app.use(cors(corsConfig))
// habilitamos que lea los datos del body en forma de json
app.use(express.json())

app.use('/',router)

app.use((error,req,res,next)=>{
    console.log('errores incio',error)
    next()
})

conectarDB(process.env.DATABASE_URL)
const port= process.env.PORT || 4000

app.listen(port, ()=>{ console.log('Devtree en el puerto',port)})