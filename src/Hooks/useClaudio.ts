import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import loginValidator from "../services/loginService";



const useClaudio = () => {

  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  function capturarError(mensaje: string) {
    setError(mensaje);
  }
  
  function obtenerNombreUsuario(value: string) {
    setNickName(value);
  }
  function obtenerContraseña(value: string) {
    setPassword(value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginValidator(nickName, password, capturarError, navigate, login);
  };
    return { handleSubmit, nickName, password, error, obtenerNombreUsuario, obtenerContraseña, capturarError , navigate, login};

}



export default useClaudio;