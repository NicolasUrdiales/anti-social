import type { Post, User, Comment } from '../types';

let users: User[] = [
  { id: '1', nickName: 'testUser' },
  { id: '2', nickName: 'unahur_dev' },
];

let posts: Post[] = [
  {
    id: '1',
    userId: '1',
    user: users[0],
    description: '¡Bienvenidos a UnaHur Anti-Social Net! 🚀 Esta es una plataforma donde puedes compartir tus pensamientos sin filtros. #welcome #unahur',
    images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop'],
    tags: ['welcome', 'unahur'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [
      {
        id: '1',
        postId: '1',
        userId: '2',
        user: users[1],
        text: '¡Genial! Me encanta la idea.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      }
    ]
  },
  {
    id: '2',
    userId: '2',
    user: users[1],
    description: 'Estudiando a tope para el TP de BackEnd y FrontEnd... ¡A darle con todo! 💻☕ #coding #tp2',
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop'],
    tags: ['coding', 'tp2'],
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    comments: []
  }
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  login: async (nickName: string): Promise<User | null> => {
    await delay(800);
    const user = users.find(u => u.nickName.toLowerCase() === nickName.toLowerCase());
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  },

  register: async (nickName: string): Promise<User> => {
    await delay(1000);
    if (users.some(u => u.nickName.toLowerCase() === nickName.toLowerCase())) {
      throw new Error("El nickName ya existe");
    }
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      nickName
    };
    users.push(newUser);
    return newUser;
  },

  getUserById: async (userId: string): Promise<User | null> => {
    await delay(300);
    return users.find(u => u.id === userId) || null;
  },

  getPosts: async (tag?: string): Promise<Post[]> => {
    await delay(800);
    const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (tag) {
      return sortedPosts.filter(p => p.tags.includes(tag));
    }
    return sortedPosts;
  },

  getPostById: async (id: string): Promise<Post | null> => {
    await delay(500);
    const post = posts.find(p => p.id === id);
    if (!post) throw new Error("Post no encontrado");
    return post;
  },

  getPostsByUser: async (userId: string): Promise<Post[]> => {
    await delay(800);
    return posts
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createPost: async (postData: { userId: string; description: string; tags: string[]; images: string[] }): Promise<Post> => {
    await delay(1200);
    const user = users.find(u => u.id === postData.userId);
    if (!user) throw new Error("Usuario no válido");
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: postData.userId,
      user,
      description: postData.description,
      tags: postData.tags,
      images: postData.images,
      createdAt: new Date().toISOString(),
      comments: []
    };
    posts.push(newPost);
    return newPost;
  },

  addComment: async (postId: string, userId: string, text: string): Promise<Comment> => {
    await delay(800);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Post no encontrado");
    const user = users.find(u => u.id === userId);
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

  getTags: async (): Promise<string[]> => {
    await delay(500);
    const allTags = new Set<string>();
    posts.forEach(p => p.tags.forEach(t => allTags.add(t)));
    ['react', 'frontend', 'backend', 'unahur', 'coding', 'tp2'].forEach(t => allTags.add(t));
    return Array.from(allTags);
  }
};
