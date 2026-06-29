import { useEffect, useState } from "react"
import { postService } from "../api/post"
import type { Post } from "../types/index"
import { ApiError } from "../api/cliente"

export function usePosts() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true

        postService
            .getPosts()
            .then((posts) => {
                if (active) {
                    setPosts(posts)
                }
            })
            .catch((error) => {
                if (active) {
                    setError(error instanceof ApiError ? error.message : "Error desconocido")
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false)
                }
            })
    }, [])

    return { posts, isLoading, error }
}