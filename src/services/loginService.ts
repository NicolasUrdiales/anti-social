import type { User } from "../types/user";




const loginValidator= async (nickName: string, password: string, capturarError: (message: string) => void, navigate: (path: string) => void, login: (user: User) => void)=>{
    try {
    
          const response = await fetch(
            "http://localhost:3000/users"
          );
    
          const users = await response.json();
    
          const userFound = users.find(
            (user: User) =>
              user.nickName === nickName
          );
    
          if (!userFound) {
            capturarError("Usuario no encontrado");
            return;
          }
    
          if (password !== "123456") {
            capturarError("Contraseña incorrecta");
            return;
          }
    
          login(userFound);
    
          navigate("/profile");
    
        } catch (error) {
    
          capturarError(JSON.stringify(error));
        }
    return {}
}

export default loginValidator