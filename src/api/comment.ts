import type { Comment, CreateCommentRequest } from "../types/index"
import { apiClient } from "./cliente"

export const commentService = {
    getComments: () => apiClient.get<Comment[]>('/comments'),
    getCommentById: (id: string) => apiClient.get<Comment>(`/comments/${id}`),
    createComment: (comment: CreateCommentRequest) => apiClient.post<Comment>('/comments', comment),
    updateComment: (id: string, comment: Partial<CreateCommentRequest>) => apiClient.put<Comment>(`/comments/${id}`, comment),
    deleteComment: (id: string) => apiClient.delete<void>(`/comments/${id}`)
}