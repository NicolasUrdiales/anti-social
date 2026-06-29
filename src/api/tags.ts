import type { Tag } from "../types/index"
import { apiClient } from "./cliente"


export const tagService = {
    getTags: () => apiClient.get<Tag[]>('/tags'),
    getTagById: (id: string) => apiClient.get<Tag>(`/tags/${id}`),
    createTag: (name:string) => apiClient.post<Tag>('/tags', {name}),
    updateTag: (id: string, name: string) => apiClient.put<Tag>(`/tags/${id}`, {name}),
    deleteTag: (id: string) => apiClient.delete<void>(`/tags/${id}`)
}