import type { User } from "../types";

export async function obtenerUsuarios(): Promise<User[]> {
  try {
    const respuesta = await fetch('http://localhost:4002/users'); 
    
    if (!respuesta.ok) {
      throw new Error('Error al obtener los usuarios del servidor');
    }

    const data: User[] = await respuesta.json();
    return data;
  } catch (error) {
    console.error("Hubo un problema con la petición:", error);
    return [];
  }  
}

export async function getUserById(userId: string): Promise<string | null> {
  const users = await obtenerUsuarios();
  const foundUser = users.find(u => u._id === userId) ?? null;
  return foundUser?._id ?? null;
}


export async function createUser(
  name: string
) {
  const response = await fetch(
    "http://localhost:4002/users/create",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        nickName: name,
      }),
    }
  );
  if (!response.ok) {
    throw new Error(
      "Error creando usuario"
    );
  }
  return await response.json();
}