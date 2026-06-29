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
    await delay(300);
    return users.find(u => u._id === userId) || null;
  },



  getPostById: async (id: string): Promise<Post | null> => {
    await delay(500);
    const post = posts.find(p => p._id === id);
    if (!post) throw new Error("Post no encontrado");
    return post;
  },

  getPostsByUser: async (userId: string): Promise<Post[]> => {
    await delay(800);
    return posts
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },




  addComment: async (postId: string, userId: string, text: string): Promise<Comment> => {
    await delay(800);
    const postIndex = posts.findIndex(p => p._id === postId);
    if (postIndex === -1) throw new Error("Post no encontrado");
    const user = users.find(u => u._id === userId);
    if (!user) throw new Error("Usuario no válido");
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      postId,
      userId,
      user,
      text,
      createdAt: new Date().toISOString()
    };
    posts[postIndex].comments.push(newComment);
    return newComment;
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
