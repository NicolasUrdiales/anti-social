import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { api } from "../../api/cliente";
import type { Post } from "../../types";

export const FeaturedPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPosts()
      .then((data) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 3);
        setPosts(shuffled);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4">
        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Destacados</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4">
      <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        Destacados
      </h3>
      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="flex gap-3 group cursor-pointer"
          >
            {post.user?.avatar ? (
              <img
                src={post.user.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shrink-0 flex items-center justify-center text-white font-bold text-sm">
                {typeof post.user === "object" && post.user
                  ? (post.user.nickName || post.user.name || "?").charAt(0).toUpperCase()
                  : "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                {typeof post.user === "object" && post.user
                  ? post.user.nickName || post.user.name || "Usuario"
                  : "Usuario"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {post.description || "Sin descripción"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
