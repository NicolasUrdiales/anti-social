import { useState, useCallback, useEffect } from 'react';
import type { Post, Tag } from '../../../types';

import { getPosts, getPostsByUser, getPostById, createPost, obtenerPosts } from '../../../services/postService';
import { getTags, getOrCreateTags } from '../../../services/tagService';
import { getUserById, obtenerUsuarios, createUser } from '../../../services/userService';

const LIMITE_PAGINACION = 3;

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagActivo, setTagActivo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(true);

  const cargarPosts = useCallback(async (tag?: string) => {
    setCargando(true);
    try {
      const postsObtenidos = await getPosts(tag);
      setPosts(postsObtenidos);

      if (pagina >= LIMITE_PAGINACION) setHayMas(false);
    } catch (error) {
      console.error("Error cargando posts:", error);
    } finally {
      setCargando(false);
    }
  }, [pagina]);

  const cargarTags = useCallback(async () => {
    try {
      const tagsObtenidos = await getTags();
      setTags(tagsObtenidos);
    } catch (error) {
      console.error("Error cargando tags:", error);
      setTags([]);
    }
  }, []);

  const cargarFeed = useCallback(async () => {
    setCargando(true);
    try {
      const [postsObtenidos, tagsObtenidos] = await Promise.all([
        getPosts(tagActivo ?? undefined),
        getTags(),
      ]);

      setPosts(postsObtenidos);
      setTags(tagsObtenidos);

      if (pagina >= LIMITE_PAGINACION) setHayMas(false);
    } catch (error) {
      console.error("Error cargando feed:", error);
    } finally {
      setCargando(false);
    }
  }, [tagActivo, pagina]);

  const cargarMas = useCallback(() => {
    if (hayMas && !cargando) {
      setPagina((prev) => prev + 1);
    }
  }, [hayMas, cargando]);

  const cambiarTag = useCallback((tag: string | null) => {
    setTagActivo(tag);
    setPagina(1);
    setHayMas(true);
  }, []);

  useEffect(() => {
    cargarFeed();
  }, [cargarFeed]);

  return {
    posts,
    tags,
    tagActivo,
    cargando,
    hayMas,
    cambiarTag,
    cargarFeed,
    cargarPosts,
    cargarTags,
    cargarMas,
  };
}
