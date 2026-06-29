import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Heart, Share, Repeat, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Post } from "../../types/index";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/cliente";
import { Dialog } from "../ui/Dialog";

interface PostCardProps {
  post: Post;
  isDetail?: boolean;
  onDelete?: (postId: string) => void;
}

export const PostCard = ({ post, isDetail = false, onDelete }: PostCardProps) => {
  const { user: currentUser } = useAuth();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
    <article className={`p-4 sm:p-5 bg-white dark:bg-gray-950 transition-colors ${!isDetail ? "border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer" : ""}`}>
      <div className="flex gap-3">
        <Link to={`/profile/${post.user.id}`} onClick={(e) => e.stopPropagation()}>
          <Avatar className="w-11 h-11 flex-shrink-0">
            <AvatarFallback>{post.user.nickName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/profile/${post.user.id}`}
                className="font-bold text-gray-900 dark:text-white hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {post.user.nickName}
              </Link>
              <span className="text-gray-400 dark:text-gray-600">·</span>
              <span className="text-gray-400 dark:text-gray-500 text-sm whitespace-nowrap">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}
              </span>
            </div>
            {currentUser && (currentUser.id === post.userId || currentUser.id === post.user?.id) && (
              <button
                onClick={handleDeletePostClick}
                className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors z-10 relative"
                title="Eliminar publicación"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className={`text-gray-900 dark:text-white whitespace-pre-wrap break-words leading-relaxed ${isDetail ? "text-xl mt-2 mb-4" : "text-[15px] mb-3"}`}>
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map(tag => (
                <span
                  key={tag._id}
                  className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  #{tag.name}
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
            <button className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group rounded-full px-2 py-1.5">
              <div className="p-1 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-sm">{post.comments?.length || 0}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-green-600 dark:hover:text-green-400 transition-colors group rounded-full px-2 py-1.5">
              <div className="p-1 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-950 transition-colors">
                <Repeat className="w-4 h-4" />
              </div>
            </button>
            <button className="flex items-center gap-1.5 hover:text-red-500 dark:hover:text-red-400 transition-colors group rounded-full px-2 py-1.5">
              <div className="p-1 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-950 transition-colors">
                <Heart className="w-4 h-4" />
              </div>
            </button>
            <button className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group rounded-full px-2 py-1.5">
              <div className="p-1 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 transition-colors">
                <Share className="w-4 h-4" />
              </div>
            </button>
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
