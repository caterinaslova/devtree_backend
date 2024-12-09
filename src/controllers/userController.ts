import type { Request,RequestHandler,Response} from 'express'
import User from "../models/userModel"
import { checkPassword, hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt'
import slugify from 'slugify'
import formidable from 'formidable'
import cloudinary from '../config/cloudinary'
import uuid from 'uuid'


export const createAccount = async(req:Request,res:Response)=>{

    const {email,password} = req.body
    const userExists = await User.findOne({email})
    if (userExists){
       const error= new Error('El email ya existe')
       res.status(409).json({mensaje:error.message})
    }else{
        const user=  new User(req.body)
        user.password = await hashPassword(password)
        const handle = slugify(req.body.handle,'')
        const handleExists = await User.findOne({handle})
        if (handleExists){
            const error= new Error('El handle ya existe')
            res.status(409).json({mensaje:error.message})
        }else{
            
            user.handle=handle
            await user.save()
            res.status(201).json({mensaje:"usuario creado"})
        }

    }
   
}  

export const login = async (req:Request,res:Response)=>{
    let mensaje:string;
    let statusCode:number;
    let token:string;
   
    const {email,password} = req.body
  
        const user = await User.findOne({email})

        if (!user){
            // const error = new Error('El email no existe')
            mensaje= "Email no existente"
            statusCode=404
        
        }else{
            const isPasswordCorrect= await checkPassword(password,user.password)
            if (!isPasswordCorrect){
                // const error= new Error('Password incorrecto')
                mensaje= "Password erronea"
                statusCode=404
                }else{
                
                    token =generateJWT({id:user._id})
                    mensaje= "Todo bien"
                    statusCode=200
                   
                }
    
        }
        res.status(statusCode).json({mensaje:token})
        return
    
}

export const getUser= async (req:Request,res:Response):Promise<any> =>{
 
 
    res.status(200).json(req.user)
   }

export const updateProfile = async (req:Request,res:Response)=>{
    try {
        const {description,links} = req.body
        const handle = slugify (req.body.handle,'')
        const handleExists = await User.findOne({handle})
        if (handleExists && handleExists.email !== req.user.email ){
            const error= new Error('El handle ya existe')
            res.status(409).json({mensaje:error.message})
            return
        }
        req.user.handle=handle
        req.user.links=links
        req.user.description=description
        await req.user.save()
        res.status(200).json({mensaje:"Usuario Modificado"})
        return
    } catch (error) {
        const errorGenerado = new Error ('Hubo un error')
        res.status(500).json({mensaje:errorGenerado.message})
        return
    }

}

export const uploadImage = (req:Request,res:Response)=>{


    const form = formidable({multiples:false})

    try {
        
        form.parse(req,(error,fields,files)=>{

            cloudinary.uploader.upload(files.file[0].filepath,{},async function (error,result) {
                if (error){
                    const errorGenerado = new Error ('Hubo un error en la carga de imagen')
                    res.status(500).json({mensaje:errorGenerado.message})
                    return
                }
                if (result){
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.status(200).json({image:result.secure_url})
                    return
                }
               
            })
           
        })

       
        // res.status(200).json({mensaje:"Fotografía agregada"})
        // return
        
    } catch (error) {
        const errorGenerado = new Error ('Hubo un error')
        res.status(500).json({mensaje:errorGenerado.message})
        return
    }
}

export const getUserByHandle = async (req:Request,res:Response)=>{
    try {
        const {handle} = req.params
        const user = await await User.findOne({handle}).select('-_id -__v -password -email')
        if(!user){
            const errorGenerado = new Error ('El usuario no existe')
            res.status(500).json({mensaje:errorGenerado.message})
            return

        }
        res.status(200).json(user)
        return
    } catch (error) {
        const errorGenerado = new Error ('Hubo un error')
        res.status(500).json({mensaje:errorGenerado.message})
        return
    }
}

export const searchHandle = async (req:Request,res:Response)=>{
    try {
        const {handle} = req.body
        const userExists = await User.findOne({handle})
        if(userExists){
            const errorGenerado = new Error (`${handle} ya está registrado`)
            res.status(409).json({mensaje:errorGenerado.message})
            return
        }
        res.status(200).send(`${handle} está disponible`)
    } catch (error) {
        const errorGenerado = new Error ('Ya existe ese handle')
        res.status(500).json({mensaje:errorGenerado.message})
        return
        
    }
}