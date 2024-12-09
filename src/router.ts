import {Router} from 'express'
import { createAccount, getUser, getUserByHandle, login, searchHandle, updateProfile, uploadImage } from './controllers/userController'
import { body } from 'express-validator'
import {handleInputErrors} from './middleware/validation'
import { authenticate } from './middleware/auth'


const router=Router()

//autenticacion y registro
router.post('/auth/register',
    body('handle').notEmpty().withMessage('probando'),
    body('name').notEmpty(),
    body('email').isEmail().withMessage('Email no valido'),
    body('password').isLength({min:8}).withMessage('minimo 8 caracteres'),
    handleInputErrors,
    createAccount)

router.post('/auth/login',
    body('email').isEmail().withMessage('Email no valido'),
    body('password').isLength({min:8}).withMessage("El password es obligatorio"),
    handleInputErrors,
    login)

router.get('/user',authenticate,getUser)
router.patch('/user',
    body('handle').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('description'),
    handleInputErrors,
    authenticate,updateProfile)

router.post('/user/image',authenticate,uploadImage)

router.post('/search',
    body('handle').notEmpty().withMessage('De escribir un nombre de usuario'),
    handleInputErrors,
    searchHandle)
    
router.get('/:handle',getUserByHandle)


export default router