const {axiosInstance} = require('./index')

//register a new user
export const RegisterUser = async (value) => {
    try{
        const response = await axiosInstance.post("api/users/register", value);
        return response;
    }catch(err){
        return err.response
    }
}


export const LoginUser = async (value) => {
    try{
        const response = await axiosInstance.post("api/users/login", value);
        return response.data;
    }catch(err){
        console.log(err);
        return err.response.data
    }
}

export const GetCurrentUser = async (value) => {
    try{
        const response = await axiosInstance.get('api/users/current',value);
        
        return response.data;
    }catch(err){

        console.log("lafanga from api")
        console.log(err);
        return err.response.data;
    }
}