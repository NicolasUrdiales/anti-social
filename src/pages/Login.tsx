import useClaudio from "../Hooks/useClaudio";

export default function LoginPage() {
  const { handleSubmit, nickName, password, error, obtenerNombreUsuario, obtenerContraseña } = useClaudio();

  return (
    <form onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Nickname"
        value={nickName}
        onChange={(e) =>
          obtenerNombreUsuario(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          obtenerContraseña(e.target.value)
        }
      />

      <button type="submit">
        Iniciar sesión
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}