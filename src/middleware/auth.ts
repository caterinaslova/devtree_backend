import type { Request,Response,NextFunction } from "express"
import User, {UserInterface} from "../models/userModel"
import jwt from 'jsonwebtoken'


declare global {
    namespace Express{
        interface Request {
            user?:UserInterface
        }
    }
}

export const authenticate = async (req:Request,res:Response,next:NextFunction)=>{
    let statusCode:number;
    let mensaje:string;
    let user:UserInterface;

    const bearer = req.headers.authorization
    if(!bearer){
        mensaje= "No autorizado"
        statusCode=401
    }else{
        const [,token]=bearer.split(' ')
        if (!token){
            mensaje= "No autorizado"
            statusCode=401
        }else{
            try {
                const result = jwt.verify(token,process.env.JWT_SECRET)
                if (typeof result === 'object' && result.id){
                    user = await User.findById(result.id).select('-password -__v')
                    if(!user){
                        mensaje= "No autorizado- usuario no existe"
                        statusCode=404
                    }else{
                        mensaje= "autorizado"
                        statusCode=200
                    }
                }

            } catch (error) {
                
                mensaje= "No autorizado desde catch"
                statusCode=401
                
            }
        }
    }
    if (statusCode  !== 200){
        res.status(statusCode).json({mensaje:mensaje})
    }else{
        req.user=user
         next()
    }
  

}