import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/cliente";
import type { Post } from "../types";
import { PostCard } from "../components/features/PostCard";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import {
  Zap, Shield, MessageCircle, Users, ArrowRight,
  TrendingUp, Star, Coffee
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Anti-instantáneo",
      desc: "Publicá tus ideas antes de pensarlo dos veces. El arrepentimiento puede esperar.",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sin algoritmos",
      desc: "Nadie decide qué ves primero. Solo el caos puro, como debe ser.",
      color: "from-indigo-400 to-purple-500",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Comentarios reales",
      desc: "Sin reacciones de emojis. Solo palabras. Las que duelen o las que alegran.",
      color: "from-pink-400 to-rose-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Comunidad UnaHur",
      desc: "Tu red universitaria. Compañeros, docentes y el TP que nunca vas a entregar a tiempo.",
      color: "from-teal-400 to-cyan-500",
    },
  ];

  const testimonials = [
    {
      nick: "@pepe_prog",
      text: "Finalmente una red donde nadie me sugiere comprar cosas raras.",
      stars: 5,
    },
    {
      nick: "@juanita_dev",
      text: "Entré a procrastinar y me quedé dos horas leyendo posts del TP2.",
      stars: 5,
    },
    {
      nick: "@nico_ciu",
      text: "La única red social que uso más que el grupo de WhatsApp de la facu.",
      stars: 5,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-300/30 dark:bg-indigo-700/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-purple-300/30 dark:bg-purple-700/20 rounded-full blur-3xl animate-float-delay" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[600px] h-72 sm:h-[600px] bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 animate-slide-up">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            Plataforma universitaria · UnaHur
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-4 sm:mb-6 text-gray-900 dark:text-white animate-slide-up delay-100 leading-tight">
            La red social
            <br />
            <span className="gradient-text italic">anti-social.</span>
          </h1>

          <p className="text-base sm:text-xl lg:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4 animate-slide-up delay-200">
            Compartí, comentá, existí. Sin algoritmos, sin sugerencias raras,
            sin tíos que mandan cadenas. Solo vos y tus ideas.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 animate-slide-up delay-300">
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold bg-gray-900 hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-full shadow-lg shadow-gray-900/20 dark:shadow-white/10 group transition-all">
                Crear cuenta gratis
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-full border-2 border-gray-200 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 hover:border-gray-400 transition-all">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-8 mt-10 sm:mt-12 animate-slide-up delay-400">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">1,200+</p>
              <p className="text-xs sm:text-sm text-gray-500">Estudiantes</p>
            </div>
            <div className="w-px h-8 sm:h-10 bg-gray-200 dark:bg-gray-700" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">8,400+</p>
              <p className="text-xs sm:text-sm text-gray-500">Publicaciones</p>
            </div>
            <div className="w-px h-8 sm:h-10 bg-gray-200 dark:bg-gray-700" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">0</p>
              <p className="text-xs sm:text-sm text-gray-500">Algoritmos</p>
            </div>
          </div>
        </div>

        <div className="hidden xl:block absolute left-8 top-1/2 -translate-y-1/2 animate-float opacity-80">
          <div className="glass-card rounded-2xl p-4 w-52 rotate-[-6deg] shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">JD</div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">juandev</p>
                <p className="text-xs text-gray-400">hace 2min</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">El TP no se entrega solo pero tampoco se hace solo 😭</p>
            <div className="flex gap-3 mt-2 text-gray-400 text-xs">
              <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 12</span>
            </div>
          </div>
        </div>

        <div className="hidden xl:block absolute right-8 top-1/3 animate-float-delay opacity-80">
          <div className="glass-card rounded-2xl p-4 w-52 rotate-[5deg] shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold">MC</div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">maricode</p>
                <p className="text-xs text-gray-400">hace 5min</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">React useEffect necesita terapia con sus dependencias 🔥</p>
            <div className="flex gap-3 mt-2 text-gray-400 text-xs">
              <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 34</span>
            </div>
          </div>
        </div>
      </section>

      <div className="py-5 bg-gray-900 dark:bg-gray-950 overflow-hidden border-y border-gray-800">
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="flex items-center gap-10 text-gray-400 text-sm font-medium">
              <span className="flex items-center gap-2 text-white"><TrendingUp className="w-4 h-4 text-indigo-400" /> Sin algoritmos</span>
              <span className="text-gray-600">·</span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> 100% universitario</span>
              <span className="text-gray-600">·</span>
              <span className="flex items-center gap-2"><Coffee className="w-4 h-4 text-orange-400" /> Hecho a las 3am</span>
              <span className="text-gray-600">·</span>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400" /> UnaHur orgullosa</span>
              <span className="text-gray-600">·</span>
            </span>
          ))}
        </div>
      </div>

      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Por qué elegirnos</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Todo lo que <span className="gradient-text">necesitás.</span>
              <br />Nada de lo que no.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-950/50 transition-all duration-300 cursor-default"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Lo que dice la <span className="gradient-text">gente.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 sm:p-6 relative noise">
                <div className="flex mb-3">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">"{t.text}"</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{t.nick}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 rounded-3xl blur-2xl" />
          <div className="relative p-8 sm:p-12 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              ¿Qué esperás?
            </h2>
            <p className="text-base sm:text-xl text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
              Unite hoy. El TP puede esperar, esta cuenta no.
            </p>
            <Link to="/register">
              <Button className="h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-base font-bold rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25 transition-all group">
                Empezar ahora — es gratis
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">A</span>
            </div>
            <span className="font-semibold text-gray-600 dark:text-gray-300">UnaHur Anti-Social Net</span>
          </div>
          <p className="text-xs text-center">© 2026 · Hecho con ☕ y demasiados merges conflictivos.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async (isReset = false) => {
    try {
      setLoading(true);
      const targetPage = isReset ? 1 : page;
      if (isReset) { setPage(1); }
      const limit = 10;
      const fetchedPosts = await api.getPosts(activeTag || undefined, targetPage, limit);
      if (isReset) {
        setPosts(fetchedPosts);
        setHasMore(fetchedPosts.length === limit);
      } else {
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newPosts = fetchedPosts.filter(p => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
        setHasMore(fetchedPosts.length === limit);
      }
      if (tags.length === 0) {
        const fetchedTags = await api.getTags();
        setTags(fetchedTags);
      }
    } catch (err) {
      console.error("Error loading feed:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTag, page, tags.length]);

  useEffect(() => { loadData(true); }, [activeTag]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore && !loading) setPage(p => p + 1); },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => { if (loaderRef.current) observer.unobserve(loaderRef.current); };
  }, [hasMore, loading]);

  useEffect(() => { if (page > 1) loadData(false); }, [page]);

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Home</h1>
      </header>

      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 whitespace-nowrap">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
              activeTag === null
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                activeTag === tag
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {loading && posts.length === 0 ? (
          <div className="flex justify-center p-10">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-10 text-center text-gray-400 dark:text-gray-600">No hay posts. ¡Sé el primero!</div>
        ) : (
          <div className="flex flex-col">
            {posts.map((post) => (
              <div key={post.id} className="relative">
                <PostCard post={post} onDelete={(deletedId) => setPosts(prev => prev.filter(p => p.id !== deletedId))} />
                <Link to={`/post/${post.id}`} className="absolute inset-0 z-0" aria-label={`Ver post de ${post.user.nickName}`} />
              </div>
            ))}
            <div ref={loaderRef} className="p-8 flex justify-center">
              {hasMore
                ? <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                : <p className="text-gray-400 text-sm">¡Ya viste todo! 🎉</p>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Home = () => {
  const { user } = useAuth();
  return user ? <FeedPage /> : <LandingPage />;
};
