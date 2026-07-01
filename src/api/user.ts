import { apiClient } from './cliente'
import type { User } from '../types/index'




export const userService = {
    async getUsers(): Promise<User[]> {
        return apiClient.get<User[]>('/users');
    },

    async getUserById(id: string): Promise<User> {
        return apiClient.get<User>(`/users/${id}`);
    },

    async createUser(user: User): Promise<User> {
        return apiClient.post<User>('/users', user);
    },

    async updateUser(id: string, user: Partial<User>): Promise<User> {
        return apiClient.put<User>(`/users/${id}`, user);
    },

    async deleteUser(id: string): Promise<void> {
        return apiClient.delete<void>(`/users/${id}`);
    },

    async getUserByNickname(nickName: string): Promise<User> {
        return apiClient.get<User>(`/user/${nickName}`);
    },

    async followUser(userId: string, followId: string): Promise<{ message: string }> {
        return apiClient.post<{ message: string }>(`/users/${userId}/follow/${followId}`, {});
    },

    async unfollowUser(userId: string, unfollowId: string): Promise<{ message: string }> {
        return apiClient.delete<{ message: string }>(`/users/${userId}/unfollow/${unfollowId}`);
    },

    async login(nickName: string, password: string): Promise<User> {
        return apiClient.post<User>('/users/login', { nickName, password });
    }

}