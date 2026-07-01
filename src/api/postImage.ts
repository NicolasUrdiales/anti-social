import type {PostImage} from "../types/index"
import { apiClient } from "./cliente"

export const postImageService = {
    getPostImages:() => apiClient.get<PostImage[]>('/postImages'),
    getPostImageById: (id: string) => apiClient.get<PostImage>(`/postImages/${id}`),
    createPostImage: (url: string, postId: string) => apiClient.post<PostImage>('/postImages', { url, post: postId }),
    upload: (file: File, postId: string) => {
        const formData = new FormData();
        formData.append('url', file);
        formData.append('post', postId);
        return apiClient.post<PostImage>('/postImages', formData)
    },
    updatePostImage: (id: string, url:string) => apiClient.put<PostImage>(`/postImages/${id}`, {url}),
    deletePostImage: (id: string) => apiClient.delete<void>(`/postImages/${id}`)
}


