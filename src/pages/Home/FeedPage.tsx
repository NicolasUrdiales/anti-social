import { Link } from "react-router-dom";
import { PostCard } from "../../components/features/PostCard";
import { useFeed } from "./hooks/useFeed";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";

export const FeedPage = () => {
  const {
    posts,
    tags,
    tagActivo,
    cargando,
    hayMas,
    cambiarTag,
    cargarMas,
  } = useFeed();

  const { refCargador } = useInfiniteScroll({
    hayMas,
    cargando,
    alCargarMas: cargarMas,
    umbral: 1,
  });

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Home
        </h1>
      </header>

      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 whitespace-nowrap">
          <button
            onClick={() => cambiarTag(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              tagActivo === null
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            All
          </button>

          {tags.map((tag) => (
            <button
              key={tag._id}
              onClick={() => cambiarTag(tag.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                tagActivo === tag.name
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {cargando && posts.length === 0 ? (
          <div className="flex justify-center p-10">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No hay posts. ¡Sé el primero!
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <div key={post._id} className="relative">
                <PostCard post={post} />
                <Link
                  to={`/post/${post._id}`}
                  className="absolute inset-0"
                />
              </div>
            ))}

            <div ref={refCargador} className="p-8 flex justify-center">
              {hayMas ? (
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <p className="text-gray-400 text-sm">
                  ¡Ya viste todo! 🎉
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
