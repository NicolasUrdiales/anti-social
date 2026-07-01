import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, Trash2, Check, X } from "lucide-react";
import type { Comment } from "../../types";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { api } from "../../api/cliente";

interface CommentItemProps {
  comment: Comment;
  onUpdate?: (commentId: string, text: string) => void;
  onDelete?: (commentId: string) => void;
}

export const CommentItem = ({ comment, onUpdate, onDelete }: CommentItemProps) => {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const userNickName = (typeof comment.user === 'object' && comment.user) ? comment.user.nickName : "Usuario";
  const userInitials = userNickName.substring(0, 2).toUpperCase();
  const isOwn = currentUser?.id === comment.userId;

  const handleSaveEdit = async () => {
    if (!editText.trim() || editText === comment.text) {
      setEditing(false);
      return;
    }
    try {
      setSaving(true);
      await api.updateComment(comment.id, editText.trim());
      onUpdate?.(comment.id, editText.trim());
      setEditing(false);
      addToast("success", "Comentario actualizado");
    } catch (err) {
      addToast("error", "Error al actualizar el comentario");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(comment.text);
    setEditing(false);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.deleteComment(comment.id);
      onDelete?.(comment.id);
      addToast("success", "Comentario eliminado");
    } catch (err) {
      addToast("error", "Error al eliminar el comentario");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex gap-3">
        <Link to={`/profile/${comment.userId}`}>
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <Link
                to={`/profile/${comment.userId}`}
                className="font-bold text-gray-900 dark:text-white hover:underline truncate"
              >
                {userNickName}
              </Link>
              <span className="text-gray-400 dark:text-gray-600">·</span>
              <span className="text-gray-400 dark:text-gray-500 text-sm whitespace-nowrap">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
              </span>
            </div>
            {isOwn && !editing && (
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  onClick={() => { setEditText(comment.text); setEditing(true); }}
                  className="p-1.5 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                  title="Editar comentario"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  title="Eliminar comentario"
                >
                  {deleting ? (
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || !editText.trim()}
                  className="p-1.5 rounded-full text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 dark:text-white text-[15px] leading-relaxed">
              {comment.text}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};
