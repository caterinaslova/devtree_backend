import { CorsOptions } from "cors";

export const corsConfig:CorsOptions={

    


    origin:function(origin,callback){
        const dominiosPermitidos =[process.env.FRONTEND_URL]
        if (process.argv[2]==="--api"){
            dominiosPermitidos.push(undefined)
        }
      
        if (dominiosPermitidos.includes(origin)){

            callback(null,true)
        }else{
            callback(new Error('Error de cors'))
        }
    }
}