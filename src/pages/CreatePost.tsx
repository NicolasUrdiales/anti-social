import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Hash, X, Upload } from "lucide-react";
import { api } from "../api/cliente";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { Input } from "../components/ui/Input";

export const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  const handleAddImage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && imageUrl.trim()) {
      e.preventDefault();
      setImages([...images, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, "");
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setError("Solo se permiten archivos de imagen.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !user) { setError("La descripción es obligatoria."); return; }
    try {
      setLoading(true);
      
      const post = await api.createPost({ userId: user.id, description, tags, images });
      
      if (selectedFile && post.id) {
        await api.uploadImage(selectedFile, post.id);
      }
      
      navigate(`/profile/${user.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear la publicación");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-10 text-center bg-white dark:bg-gray-950 min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Iniciá sesión para publicar.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nueva publicación</h1>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!description.trim() || loading}
          className="rounded-full px-5 font-bold mr-1"
        >
          {loading ? "Publicando..." : "Publicar"}
        </Button>
      </header>

      <div className="p-4 flex gap-3 flex-1">
        <Avatar className="w-11 h-11 flex-shrink-0">
          <AvatarFallback>{user.nickName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 flex flex-col">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué tenés en mente?"
            className="w-full text-lg border-none outline-none resize-none min-h-[140px] bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-white py-2 leading-relaxed"
            autoFocus
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {previewUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 max-h-[280px] mb-4">
              <img src={previewUrl} alt="Vista previa de imagen subida" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeSelectedFile}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {images.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 max-h-[280px]">
                  <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium border border-indigo-100 dark:border-indigo-900">
                  #{tag}
                  <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-indigo-900 dark:hover:text-indigo-200 ml-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      
      <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-4">
        
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            <Upload className="w-4 h-4" /> {isMobile ? "Subir imagen desde tu dispositivo" : "Subir imagen desde tu PC"}
          </label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20"
                : "border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-800"
            }`}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            {selectedFile ? (
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Archivo seleccionado: <span className="text-indigo-600 dark:text-indigo-400">{selectedFile.name}</span>
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {isMobile ? (
                    <span>Tocá acá para seleccionar una imagen de tu <span className="text-indigo-600 dark:text-indigo-400 underline">dispositivo</span></span>
                  ) : (
                    <span>Arrastrá y soltá una imagen acá, o <span className="text-indigo-600 dark:text-indigo-400 underline">buscá en tu PC</span></span>
                  )}
                </p>
                <p className="text-xs text-gray-400">Formatos recomendados: PNG, JPG, JPEG, WEBP</p>
              </div>
            )}
          </div>
        </div>

       
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            <Hash className="w-4 h-4" /> Agregar etiquetas
          </label>
          <Input
            placeholder="Escribí una etiqueta y presioná Enter..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
          />
        </div>
      </div>
    </div>
  );
};
