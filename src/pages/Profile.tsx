import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CalendarDays, LogOut, Trash2 } from "lucide-react";
import { api } from "../api/cliente";
import type { Post, User } from "../types";
import { useAuth } from "../context/AuthContext";
import { PostCard } from "../components/features/PostCard";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Dialog } from "../components/ui/Dialog";

export const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, logout } = useAuth();
  const profileId = id || currentUser?.id;
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const isOwnProfile = currentUser?.id === profileId;

  const isFollowing = currentUser && profileUser?.followers?.some((f: any) => 
    typeof f === 'string' ? f === currentUser.id : f.id === currentUser.id || f._id === currentUser.id
  );

  const handleFollowToggle = async () => {
    if (!currentUser || !profileUser || followLoading) return;
    try {
      setFollowLoading(true);
      if (isFollowing) {
        await api.unfollowUser(currentUser.id, profileUser.id);
      } else {
        await api.followUser(currentUser.id, profileUser.id);
      }
      const updatedUser = await api.getUserById(profileUser.id);
      setProfileUser(updatedUser);
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setIsDeleteAccountOpen(true);
  };

  const handleConfirmDeleteAccount = async () => {
    if (!currentUser) return;
    try {
      await api.deleteUser(currentUser.id);
      logout();
      navigate("/register");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error al eliminar la cuenta");
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) return;
      try {
        setLoading(true);
        const u = await api.getUserById(profileId);
        if (u) {
          setProfileUser(u);
          const userPosts = await api.getPostsByUser(profileId);
          setPosts(userPosts);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [profileId]);

  if (loading) {
    return (
      <div className="flex justify-center p-10 bg-white dark:bg-gray-950 min-h-screen">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mt-4" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="p-10 text-center bg-white dark:bg-gray-950 min-h-screen">
        <p className="text-xl text-gray-500 dark:text-gray-400">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-4">
        <Link
          to="/"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{profileUser.nickName}</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">{posts.length} posts</p>
        </div>
      </header>

      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="h-36 sm:h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
        <div className="px-4 pb-4">
          <div className="flex items-end justify-between -mt-12 sm:-mt-16 mb-4">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white dark:border-gray-950 shadow-xl">
              <AvatarFallback className="text-3xl sm:text-4xl">
                {profileUser.nickName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="font-bold rounded-full flex items-center gap-2"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Cerrar sesión</span>
                </Button>
                <Button
                  variant="destructive"
                  className="font-bold rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-4 py-2"
                  onClick={handleDeleteAccountClick}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Eliminar cuenta</span>
                </Button>
              </div>
            ) : (
              currentUser && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  className="font-bold rounded-full px-5"
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                >
                  {followLoading ? "Cargando..." : isFollowing ? "Dejar de seguir" : "Seguir"}
                </Button>
              )
            )}
          </div>

          <h2 className="text-2xl font-black text-gray-900 dark:text-white">{profileUser.nickName}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-3">@{profileUser.nickName.toLowerCase()}</p>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-indigo-500" /> Universidad Nacional de Hurlingham
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4 text-indigo-500" /> Junio 2026
            </span>
          </div>

          <div className="flex gap-5 text-sm">
            <p className="text-gray-900 dark:text-white"><span className="font-bold">{profileUser.following?.length || 0}</span> <span className="text-gray-500 dark:text-gray-400">Siguiendo</span></p>
            <p className="text-gray-900 dark:text-white"><span className="font-bold">{profileUser.followers?.length || 0}</span> <span className="text-gray-500 dark:text-gray-400">Seguidores</span></p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-100 dark:border-gray-800">
        <button className="flex-1 py-4 text-sm font-bold text-gray-900 dark:text-white border-b-2 border-indigo-600">
          Posts
        </button>
        <button className="flex-1 py-4 text-sm font-bold text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
          Respuestas
        </button>
        <button className="flex-1 py-4 text-sm font-bold text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
          Likes
        </button>
      </div>

      <div className="flex-1">
        {posts.length === 0 ? (
          <div className="p-10 text-center text-gray-400 dark:text-gray-600">
            Sin posts aún.
          </div>
        ) : (
          <div className="flex flex-col">
            {posts.map((post) => (
              <div key={post.id} className="relative">
                <PostCard post={post} onDelete={(deletedId) => setPosts(prev => prev.filter(p => p.id !== deletedId))} />
                <Link
                  to={`/post/${post.id}`}
                  className="absolute inset-0 z-0"
                  aria-label={`Ver post de ${post.user.nickName}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
        title="¿Eliminar cuenta?"
        description="¿Estás seguro de que querés eliminar tu cuenta? Esta acción es definitiva y borrará todas tus publicaciones y datos."
        onConfirm={handleConfirmDeleteAccount}
        confirmText="Eliminar Cuenta"
        variant="destructive"
      />
    </div>
  );
};
