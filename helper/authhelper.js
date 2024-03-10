import bcrypt, { hash } from "bcrypt"

export const  hashedPassword = async(password) => {
  
    try {
         const saltRounds = 10
         const hash = await bcrypt.hash(password, saltRounds)
   return hash

    } catch (error) {
        console.log(error);
    }



}

export const comparePassword = async(password, hash) => {
    try {
      return await bcrypt.compare(password, hash)
    } catch (error) {
        console.log(error);
    }
}