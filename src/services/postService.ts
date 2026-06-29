import type { Post, User } from '../types';
import { getOrCreateTags } from './tagService';

export const createPost = async (
  postData: {
    user: User;
    description: string;
    tags: string[];
  }
): Promise<Post> => {

  // 1️⃣ Obtener IDs reales
  const tagIds =
    await getOrCreateTags(
      postData.tags
    );

  // 2️⃣ Crear post
  const response = await fetch(
    "http://localhost:4002/posts/create",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        description:
          postData.description,

        user:
          postData.user._id,

        tags: tagIds,
      }),
    }
  );

  // 3️⃣ Validar respuesta
  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(errorText);
  }

  // 4️⃣ Obtener post creado
  const newPost =
    await response.json();

  return newPost;
}



export async function obtenerPosts(): Promise<Post[]> {
  try {
    const respuesta = await fetch('http://localhost:4002/posts'); 
    
    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar las publicaciones');
    }

    const data: Post[] = await respuesta.json();
    return data;
  } catch (error) {
    console.error("Error al traer los posts:", error);
    return [];
  }
}
const posts= await obtenerPosts()


export async function getPosts (tag?: string): Promise<Post[]>{
    const sortedPosts =
      
      [...posts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime()
          -
          new Date(a.createdAt).getTime()
      );
    // Filtrar si hay tag
    if (tag) {
      return sortedPosts.filter(
        (p) =>
          p.tags.includes(tag)
      );
    }
    // Retornar posts
    return sortedPosts;
}

export async function getPostsByUser  (userId: string): Promise<Post[]>{
    return posts
      .filter(p => p.user._id === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

export async function getPostById (id: string): Promise<string | null> {
    const post = posts.find(p => p._id === id);
    if (!post) throw new Error("Post no encontrado");
    return post._id;
  }
