import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken";

const createToken =(payLoad: JwtPayload, secret:string, expiresIn: SignOptions)=>{

    const token = jwt.sign(payLoad,secret,{expiresIn}as SignOptions)

    return token

}

const verifyToken = (token:string, secret:string)=> {
    try {
        const decoded = jwt.verify(token, secret);
        return {
            success:true,
            data: decoded
        }
    } catch (error:any) {
        console.log("Error verifying token:", error);
       return {
        success: false,
        error: error.message
       }
    }
};

export const jwtUtils = {
    createToken,
    verifyToken
}