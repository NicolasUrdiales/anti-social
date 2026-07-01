import type { User, Post, Comment, CreatePostRequest, CreateCommentRequest, Tag, PostImage } from '../types/index'

const BASE_URL = "http://localhost:4002"
import { postService } from './post'
import { userService } from './user'
import { commentService } from './comment'
import { tagService } from './tags'
import { postImageService } from './postImage'


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




export const api = {
  
  login: async (nickName: string, password: string): Promise<User> => {
    return userService.login(nickName, password)
  },

  register: async (nickName: string, password: string): Promise<User> => {
    return userService.createUser({ nickName, password } as User)
  },

  async enrichPostTags(post: Post): Promise<Post> {
    if (!post.tags || post.tags.length === 0) return post
    const allTags = await tagService.getTags().catch(() => [] as Tag[])
    post.tags = post.tags.map(t => {
      const id = typeof t === 'string' ? t : (t as any)._id || (t as any).id
      const found = allTags.find(tag => tag.id === id)
      if (found) return { _id: found.id, name: found.name }
      if (typeof t === 'string') return { _id: t, name: t }
      return { _id: (t as any)._id || (t as any).id || '', name: (t as any).name || t }
    })
    return post
  },

  getPosts: async (tag?: string, page?: number, limit?: number): Promise<Post[]> => {
    const posts = await postService.getPosts(page, limit, tag)
    return Promise.all(posts.map(p => api.enrichPostTags(p)))
  },

  getPostById: async (id: string): Promise<Post> => {
    const post = await postService.getPostById(id)
    return api.enrichPostTags(post)
  },

  getPostsByUser: async (userId: string): Promise<Post[]> => {
    const posts = await postService.getPosts(1, 999)
    const userPosts = posts.filter((p) => p.userId === userId || p.user?.id === userId)
    return Promise.all(userPosts.map(p => api.enrichPostTags(p)))
  },

  createPost: async (data: { userId: string; description: string; tags?: string[]; images?: string[] }): Promise<Post> => {
    const body: CreatePostRequest = {
      description: data.description,
      user: data.userId,
      tags: data.tags,
      images: data.images?.map((url) => ({ url })),
    }
    const post = await postService.createPost(body)
    console.log("createPost response:", post)
    const enriched = await api.enrichPostTags(post)
    return enriched
  },

  deletePost: (id: string): Promise<void> =>
    postService.deletePost(id),

  updateComment: async (commentId: string, text: string): Promise<Comment> =>
    commentService.updateComment(commentId, { text }),

  deleteComment: async (commentId: string): Promise<void> =>
    commentService.deleteComment(commentId),

  addComment: async (postId: string, userId: string, text: string): Promise<Comment> => {
    const body: CreateCommentRequest = { post: postId, user: userId, text }
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

  getUserByNickname: (nickName: string): Promise<User> =>
    userService.getUserByNickname(nickName),

  getUsers: (): Promise<User[]> =>
    userService.getUsers(),

  deleteUser: (id: string): Promise<void> =>
    userService.deleteUser(id),

  getTags: async (): Promise<string[]> => {
    const tags = await tagService.getTags()
    return tags.map((t: Tag) => t.name)
  },

  getTagObjects: async (): Promise<Tag[]> => {
    return tagService.getTags()
  },

  createTag: async (name: string): Promise<Tag> => {
    const tag = await tagService.createTag(name)
    console.log("createTag response:", tag)
    return tag
  },

  createPostImage: (url: string, postId: string): Promise<PostImage> =>
    postImageService.createPostImage(url, postId),

  uploadImage: (file: File, postId: string): Promise<PostImage> =>
    postImageService.upload(file, postId),

  getPostImages: (): Promise<PostImage[]> =>
    postImageService.getPostImages(),

  deletePostImage: (id: string): Promise<void> =>
    postImageService.deletePostImage(id),

  followUser: (userId: string, followId: string): Promise<{ message: string }> =>
    userService.followUser(userId, followId),

  unfollowUser: (userId: string, unfollowId: string): Promise<{ message: string }> =>
    userService.unfollowUser(userId, unfollowId),
}
