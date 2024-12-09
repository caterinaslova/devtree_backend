import mongoose from 'mongoose'

export const conectarDB =async(stringConexion:string)=>{
    try {
        const conexion = await mongoose.connect(stringConexion)
        console.log('Base de datos conectada')
    } catch (error) {
        console.log('Error al conectar la base de datos:', error.message)
        process.exit(1)
        
    }
}