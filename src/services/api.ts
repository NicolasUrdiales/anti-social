import type { Post, User, Comment } from '../types';
import { obtenerPosts } from './postService';
import { createUser } from './userService';

async function obtenerUsuarios(): Promise<User[]> {
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


const users: User[] | [] = await obtenerUsuarios();

const posts: Post[]|[] = await obtenerPosts();





const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  login: async (nickName: string): Promise<User | null> => {
    await delay(800);
    const user = users.find(u => u.nickName.toLowerCase() === nickName.toLowerCase());
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  },

  register: async (nickName: string): Promise<User> => {
    const newUser = await createUser(nickName);
    users.push(newUser);
    return newUser;
  },

  
  getUserById: async (userId: string): Promise<User | null> => {
    try {
      const response = await fetch(`http://localhost:4002/users/${userId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  getPostById: async (id: string): Promise<Post | null> => {
    const response = await fetch(`http://localhost:4002/posts/${id}`);
    if (!response.ok) throw new Error("Post no encontrado");
    const post: Post = await response.json();
    return {
      ...post,
      userId: typeof post.user === 'string' ? post.user : post.user?._id,
    };
  },

  getPostsByUser: async (userId: string): Promise<Post[]> => {
    try {
      const response = await fetch('http://localhost:4002/posts');
      if (!response.ok) return [];
      const allPosts: Post[] = await response.json();
      return allPosts
        .filter(p => {
          const uid = typeof p.user === 'string' ? p.user : p.user?._id;
          return uid === userId;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map(p => ({
          ...p,
          userId: typeof p.user === 'string' ? p.user : p.user?._id,
        }));
    } catch {
      return [];
    }
  },

  addComment: async (postId: string, userId: string, text: string): Promise<Comment> => {
    const response = await fetch('http://localhost:4002/comments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, user: userId, post: postId }),
    });
    if (!response.ok) throw new Error("Error al crear comentario");
    return await response.json();
  },

  /*getTags: async (): Promise<string[]> => {
    await delay(500);
    const allTags = new Set<string>();
    posts.forEach(p => p.tags.forEach(t => allTags.add(t)));
    ['react', 'frontend', 'backend', 'unahur', 'coding', 'tp2'].forEach(t => allTags.add(t));
    return Array.from(allTags);
  }
  */
};
