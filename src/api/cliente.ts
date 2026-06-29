import type { User, Post, Comment, CreatePostRequest, CreateCommentRequest, Tag, PostImage } from '../types/index'

const BASE_URL = "http://localhost:4002"

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

function normalizeIds(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(normalizeIds);
  }
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = normalizeIds(obj[key]);
      }
    }
    if (obj._id && !obj.id) {
      obj.id = obj._id;
    } else if (obj.id && !obj._id) {
      obj._id = obj.id;
    }
  }
  return obj;
}
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {})
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: headers as HeadersInit
  })

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText)
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) return null as unknown as T;

  const data = await res.json();
  return normalizeIds(data) as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? body : JSON.stringify(body)
    });
  },

  put: <T>(endpoint: string, body: unknown, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body)
    });
  },

  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: isFormData ? body : JSON.stringify(body)
    });
  },

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
}
import { postService } from './post'
import { userService } from './user'
import { commentService } from './comment'
import { tagService } from './tags'
import { postImageService } from './postImage'



export const api = {
  
  login: async (nickName: string , password: string): Promise<User> => {
    return userService.login(nickName, password)
  },

  register: async (nickName: string, password: string): Promise<User> => {
    return userService.createUser({ nickName, password } as User)
  },

  getPosts: async (tag?: string, page?: number, limit?: number): Promise<Post[]> => {
    return postService.getPosts(page, limit, tag)
  },

  getPostById: (id: string): Promise<Post> =>
    postService.getPostById(id),

  getPostsByUser: async (userId: string): Promise<Post[]> => {
    const posts = await postService.getPosts()
    return posts.filter((p) => p.userId === userId || p.user?.id === userId)
  },

  createPost: (data: { userId: string; description: string; tags?: string[]; images?: string[] }): Promise<Post> => {
    const body: CreatePostRequest = {
      description: data.description,
      user: data.userId,
      tags: data.tags,
      images: data.images?.map((url) => ({ url })),
    }
    return postService.createPost(body)
  },

  deletePost: (id: string): Promise<void> =>
    postService.deletePost(id),

  addComment: async (postId: string, userId: string, text: string): Promise<Comment> => {
    const body: CreateCommentRequest = { postId, userId, text }
    const newComment = await commentService.createComment(body)
    try {
      const user = await userService.getUserById(userId)
      newComment.user = user
    } catch (e) {
      console.error("Error populating user for comment", e)
    }
    return newComment
  },

  getUserById: (id: string): Promise<User> =>
    userService.getUserById(id),

  getUsers: (): Promise<User[]> =>
    userService.getUsers(),

  deleteUser: (id: string): Promise<void> =>
    userService.deleteUser(id),

  getTags: async (): Promise<string[]> => {
    const tags = await tagService.getTags()
    return tags.map((t: Tag) => t.name)
  },

  uploadImage: (file: File, postId: string): Promise<PostImage> =>
    postImageService.upload(file, postId),

  followUser: (userId: string, followId: string): Promise<{ message: string }> =>
    userService.followUser(userId, followId),

  unfollowUser: (userId: string, unfollowId: string): Promise<{ message: string }> =>
    userService.unfollowUser(userId, unfollowId),
}
