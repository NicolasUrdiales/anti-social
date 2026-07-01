import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Heart, Trash2, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Post } from "../../types/index";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/cliente";
import { Dialog } from "../ui/Dialog";

const LIKES_KEY = "unahur_post_likes";

function getStoredLikes(postId: string): string[] {
  try {
    const all = JSON.parse(localStorage.getItem(LIKES_KEY) || "{}");
    return all[postId] || [];
  } catch {
    return [];
  }
}

function setStoredLikes(postId: string, likes: string[]) {
  try {
    const all = JSON.parse(localStorage.getItem(LIKES_KEY) || "{}");
    all[postId] = likes;
    localStorage.setItem(LIKES_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

interface PostCardProps {
  post: Post;
  isDetail?: boolean;
  onDelete?: (postId: string) => void;
}

export const PostCard = ({ post, isDetail = false, onDelete }: PostCardProps) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [likes, setLikes] = useState<string[]>(() => getStoredLikes(post.id));
  const userId = typeof post.user === 'string' ? post.user : post.user?.id;
  const userName = typeof post.user === 'string' ? post.user : post.user?.nickName || 'Usuario';
  const isLiked = currentUser ? likes.includes(currentUser.id) : false;

  useEffect(() => {
    setStoredLikes(post.id, likes);
  }, [likes, post.id]);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;
    setLikes(prev => {
      if (prev.includes(currentUser.id)) {
        return prev.filter(id => id !== currentUser.id);
      }
      return [...prev, currentUser.id];
    });
  };

  const handleDeletePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.deletePost(post.id);
      if (onDelete) onDelete(post.id);
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("No se pudo eliminar la publicación");
    }
  };

  return (
    <article className={`p-4 sm:p-5 bg-white dark:bg-gray-950 transition-colors relative z-10 ${!isDetail ? "border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer" : ""}`}>
      <div className="flex gap-3 relative z-10">
        <Link to={`/profile/${userId}`} onClick={(e) => e.stopPropagation()}>
          <Avatar className="w-11 h-11 flex-shrink-0">
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/profile/${userId}`}
                className="font-bold text-gray-900 dark:text-white hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {userName}
              </Link>
              <span className="text-gray-400 dark:text-gray-600">·</span>
              <span className="text-gray-400 dark:text-gray-500 text-sm whitespace-nowrap">
                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es }) : ''}
              </span>
            </div>
            {currentUser && (currentUser.id === post.userId || currentUser.id === userId) && (
              <button
                onClick={handleDeletePostClick}
                className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Eliminar publicación"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className={`text-gray-900 dark:text-white whitespace-pre-wrap break-words leading-relaxed ${isDetail ? "text-xl mt-2 mb-4" : "text-[15px] mb-3"}`}>
            {post.description}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag, i) => (
                <span
                  key={typeof tag === 'string' ? tag : tag._id || tag.id || i}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/15 dark:to-purple-400/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60"
                >
                  #{typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          )}

          {post.images && post.images.length > 0 && (
            <div className="mt-3 mb-4 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
              <img
                src={post.images[0].url}
                alt="Post content"
                className="w-full h-auto object-cover max-h-[500px]"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-600 mt-2 -ml-2">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/post/${post.id}`); }}
              className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group rounded-full px-2 py-1.5"
            >
              <div className="p-1 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-sm">{post.comments?.length || 0}</span>
            </button>
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-1.5 transition-colors group rounded-full px-2 py-1.5 ${isLiked ? 'text-red-500' : 'text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400'}`}
            >
              <div className={`p-1 rounded-full transition-colors ${isLiked ? 'bg-red-50 dark:bg-red-950' : 'group-hover:bg-red-50 dark:group-hover:bg-red-950'}`}>
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
              </div>
              <span className="text-sm">{likes.length}</span>
            </button>
            {!isDetail && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/post/${post.id}`); }}
                className="ml-auto flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-sm transition-colors px-3 py-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                Ver más
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
      <Dialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="¿Eliminar publicación?"
        description="¿Estás seguro de que querés eliminar esta publicación? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        confirmText="Eliminar"
        variant="destructive"
      />
    </article>
  );
};
