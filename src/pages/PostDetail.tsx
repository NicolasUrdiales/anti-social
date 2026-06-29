import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { api } from "../api/cliente";
import type { Post } from "../types";
import { useAuth } from "../context/AuthContext";
import { PostCard } from "../components/features/PostCard";
import { CommentItem } from "../components/features/CommentItem";
import { Button } from "../components/ui/Button";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const fetchedPost = await api.getPostById(id);
        setPost(fetchedPost);
      } catch {
        setError("Post no encontrado");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !post || !user) return;
    try {
      setSubmittingComment(true);
      const newComment = await api.addComment(post.id, user.id, commentText);
      setPost((prev: Post | null) => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10 bg-white dark:bg-gray-950 min-h-screen">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mt-4" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-10 text-center bg-white dark:bg-gray-950 min-h-screen">
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">Post no encontrado</p>
        <Button onClick={() => navigate("/")}>Volver al inicio</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Post</h1>
      </header>

      <div className="border-b border-gray-100 dark:border-gray-800">
        <PostCard post={post} isDetail={true} onDelete={() => navigate("/")} />
      </div>

      {user ? (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <form onSubmit={handleAddComment} className="flex gap-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback>{user.nickName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Escribí tu respuesta..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 py-2"
                autoComplete="off"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!commentText.trim() || submittingComment}
                  className="rounded-full px-5 font-bold text-sm"
                >
                  {submittingComment ? "Enviando..." : "Responder"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-6 text-center bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 mb-3">Iniciá sesión para comentar</p>
          <Button size="sm" onClick={() => navigate("/login")}>
            <MessageCircle className="w-4 h-4 mr-2" /> Iniciar sesión
          </Button>
        </div>
      )}

      <div className="flex-1">
        {post.comments.length === 0 ? (
          <div className="p-10 text-center text-gray-400 dark:text-gray-600">
            Sin comentarios aún. ¡Sé el primero en responder!
          </div>
        ) : (
          <div className="flex flex-col">
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
