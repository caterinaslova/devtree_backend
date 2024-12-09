import type {Request,Response,NextFunction} from 'express'
import { validationResult } from 'express-validator'

export const handleInputErrors=(req:Request,res:Response,next:NextFunction)=>{

           // manejar Errores
           let errors = validationResult(req)
           if (!errors.isEmpty()){
                res.status(400).json({mensaje:errors.array()})
           }
           next()

}