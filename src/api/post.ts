import type { CreatePostRequest, Post } from "../types/index"

import { apiClient } from "./cliente"

export const postService = {
    getPosts:(page?: number, limit?: number, tag?: string) => apiClient.get<Post[]>(`/posts?page=${page || 1}&limit=${limit || 10}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`),
    getPostById: (id: string) => apiClient.get<Post>(`/posts/${id}`),
    createPost: (post: CreatePostRequest) => apiClient.post<Post>('/posts', post),
    updatePost: (id: string, post: Partial<CreatePostRequest>) => apiClient.put<Post>(`/posts/${id}`, post),
    deletePost: (id: string) => apiClient.delete<void>(`/posts/${id}`),
    getCommentsByPostId: (postId: string) => apiClient.get<Comment[]>(`/posts/${postId}/comments`),
    getTagsByPostId: (postId: string) => apiClient.get<string[]>(`/posts/${postId}/tags`),

    addImage: (id: string, url: string) => apiClient.post<Post>(`/posts/${id}/images`, { url }),
    addTag: (id: string, tagId: string) => apiClient.post<Post>(`/posts/${id}/tags`, { tagId }),

}