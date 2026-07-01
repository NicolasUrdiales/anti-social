# Anti-Social Net 🚀

Red social universitaria construida con React + TypeScript + Vite + Tailwind CSS v4.

---

## Descripción del proyecto

Anti-Social Net es una red social temática para laUniversidad Nacional de Hurlingham (UNAHUR). Los usuarios pueden registrarse, iniciar sesión, crear publicaciones con texto, imágenes y etiquetas, dar like a publicaciones (persistido en localStorage), comentar (CRUD completo), seguir a otros usuarios, buscar usuarios por nickname, y filtrar publicaciones por etiquetas. Incluye modo oscuro, diseño responsive, scroll infinito, y notificaciones toast.

---

## URL de la API utilizada

```
http://localhost:4002
```

El backend corre localmente en el puerto `4002`. Todos los endpoints se consumen a través del objeto `api` en `src/api/cliente.ts`.

---

## Instrucciones para correr en local

### Requisitos

- Node.js v18+
- npm v9+
- Backend de Anti-Social corriendo en `http://localhost:4002`

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd anti-social

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo Vite |
| `npm run build` | TypeScript check + build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Previsualiza build de producción |

### Demo

```
Usuario: testUser
Contraseña: 123456
```

---

## Estructura del proyecto

```
anti-social/
├── public/                   # Archivos estáticos (favicon, iconos SVG)
├── src/
│   ├── api/                  # Capa de comunicación con el backend (API REST)
│   ├── assets/               # Imágenes y recursos estáticos
│   ├── components/
│   │   ├── features/         # Componentes de funcionalidad específica
│   │   ├── layout/           # Componentes de layout y estructura
│   │   └── ui/               # Componentes de interfaz reutilizables (primitivas)
│   ├── context/              # Contextos globales de React (estado compartido)
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilidades generales
│   ├── pages/                # Componentes de página (cada ruta)
│   ├── routes/               # Guards y configuración de rutas
│   ├── types/                # Definiciones de TypeScript (interfaces)
│   └── utils/                # Utilidades auxiliares
├── index.html                # Entry point HTML
├── vite.config.ts            # Configuración de Vite
├── tsconfig.json             # Configuración raíz de TypeScript
├── tsconfig.app.json         # Configuración TS para la app
├── tsconfig.node.json        # Configuración TS para Node (vite.config)
├── eslint.config.js          # Reglas de ESLint
└── package.json              # Dependencias y scripts
```

---

## `src/api/` — Capa de comunicación con el backend

Cada archivo exporta un service object con métodos para interactuar con endpoints específicos. El archivo `cliente.ts` unifica todos los servicios en un único objeto `api`.

### `cliente.ts`
Cliente HTTP central. Exporta:

| Exportación | Descripción |
|---|---|
| `class ApiError` | Error personalizado con código `status` HTTP |
| `normalizeIds(obj)` | Normaliza `_id` → `id` recursivamente en objetos |
| `request<T>(endpoint, options?)` | Wrapper de `fetch`: maneja headers, JSON/FormData, errores, parseo y normalize |
| `apiClient` | Objeto con métodos `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()` |
| `api` | **Objeto unificado** con todos los métodos del backend |

**Métodos del objeto `api`:**

| Método | Firma | Descripción |
|---|---|---|
| `login` | `(nickName, password) => Promise<User>` | Autentica usuario vía `POST /users/login` |
| `register` | `(nickName, password) => Promise<User>` | Registra nuevo usuario |
| `getPosts` | `(tag?, page?, limit?) => Promise<Post[]>` | Posts paginados, opcionalmente filtrados por tag |
| `getPostById` | `(id) => Promise<Post>` | Post individual por ID |
| `getPostsByUser` | `(userId) => Promise<Post[]>` | Todos los posts de un usuario |
| `createPost` | `({userId, description, tags?, images?}) => Promise<Post>` | Crea un post |
| `deletePost` | `(id) => Promise<void>` | Elimina un post |
| `addComment` | `(postId, userId, text) => Promise<Comment>` | Agrega comentario (popula usuario) |
| `updateComment` | `(commentId, text) => Promise<Comment>` | Edita comentario |
| `deleteComment` | `(commentId) => Promise<void>` | Elimina comentario |
| `getUserById` | `(id) => Promise<User>` | Usuario por ID |
| `getUserByNickname` | `(nickName) => Promise<User>` | Usuario por nickname |
| `getUsers` | `() => Promise<User[]>` | Todos los usuarios |
| `deleteUser` | `(id) => Promise<void>` | Elimina usuario |
| `getTags` | `() => Promise<string[]>` | Nombres de tags |
| `getTagObjects` | `() => Promise<Tag[]>` | Tags como objetos completos |
| `createTag` | `(name) => Promise<Tag>` | Crea un tag |
| `createPostImage` | `(url, postId) => Promise<PostImage>` | Vincula imagen URL a un post |
| `uploadImage` | `(file, postId) => Promise<PostImage>` | Sube archivo de imagen a un post |
| `getPostImages` | `() => Promise<PostImage[]>` | Todas las imágenes |
| `deletePostImage` | `(id) => Promise<void>` | Elimina imagen |
| `followUser` | `(userId, followId) => Promise<{message}>` | Sigue a un usuario |
| `unfollowUser` | `(userId, unfollowId) => Promise<{message}>` | Deja de seguir |

---

### `comment.ts`
Servicio CRUD de comentarios.

| Método | Descripción |
|---|---|
| `getComments()` | Obtiene todos los comentarios |
| `getCommentById(id)` | Comentario por ID |
| `createComment(comment)` | Crea un comentario |
| `updateComment(id, comment)` | Actualiza texto de comentario |
| `deleteComment(id)` | Elimina comentario |

### `post.ts`
Servicio CRUD de posts.

| Método | Descripción |
|---|---|
| `getPosts(page?, limit?, tag?)` | Posts paginados con filtro opcional por tag |
| `getPostById(id)` | Post individual |
| `createPost(post)` | Crea post |
| `updatePost(id, post)` | Actualiza post |
| `deletePost(id)` | Elimina post |
| `getCommentsByPostId(postId)` | Comentarios de un post |
| `getTagsByPostId(postId)` | Tags de un post |
| `addImage(id, url)` | Agrega imagen a post |
| `addTag(id, tagId)` | Agrega tag a post |

### `postImage.ts`
Servicio de imágenes asociadas a posts.

| Método | Descripción |
|---|---|
| `getPostImages()` | Todas las imágenes |
| `getPostImageById(id)` | Imagen por ID |
| `createPostImage(url, postId)` | Crea registro de imagen desde URL |
| `upload(file, postId)` | Sube archivo como FormData |
| `updatePostImage(id, url)` | Actualiza URL de imagen |
| `deletePostImage(id)` | Elimina imagen |

### `tags.ts`
Servicio CRUD de tags.

| Método | Descripción |
|---|---|
| `getTags()` | Todos los tags (nombres) |
| `getTagById(id)` | Tag por ID |
| `createTag(name)` | Crea un tag |
| `updateTag(id, name)` | Renombra tag |
| `deleteTag(id)` | Elimina tag |

### `user.ts`
Servicio de usuarios + follow/unfollow + login.

| Método | Descripción |
|---|---|
| `getUsers()` | Todos los usuarios |
| `getUserById(id)` | Usuario por ID |
| `createUser(user)` | Registra usuario |
| `updateUser(id, user)` | Actualiza datos de usuario |
| `deleteUser(id)` | Elimina usuario |
| `getUserByNickname(nickName)` | Busca por nickname |
| `followUser(userId, followId)` | Sigue a un usuario |
| `unfollowUser(userId, unfollowId)` | Deja de seguir |
| `login(nickName, password)` | Autentica contra el backend |

---

## `src/types/` — Interfaces de TypeScript

### `index.ts`
Define todos los tipos del dominio.

| Interfaz | Campos | Descripción |
|---|---|---|
| `User` | `id`, `nickName`, `password`, `followers[]`, `following[]` | Usuario base |
| `UserDetail` | `id`, `nickName`, `followers: {id, nickName}[]`, `posts`, `comentarios` | Usuario expandido con relaciones pobladas |
| `CreateUserRequest` | `nickName`, `password` | Payload de registro |
| `PostTag` | `_id`, `name` | Tag asociado a un post |
| `Post` | `id`, `userId`, `user`, `description`, `images: {url}[]`, `tags`, `createdAt`, `comments`, `likes?` | Publicación completa |
| `CreatePostRequest` | `description`, `user`, `images?`, `tags?` | Payload para crear post |
| `Comment` | `id`, `postId`, `userId`, `user`, `text`, `createdAt` | Comentario |
| `CreateCommentRequest` | `post`, `user`, `text` | Payload para crear comentario |
| `Tag` | `id`, `name` | Etiqueta |
| `PostImage` | `id`, `url`, `post` | Imagen asociada a post |

---

## `src/context/` — Contextos globales de React

### `AuthContext.tsx`
Maneja el estado de autenticación del usuario. Persiste en `localStorage` bajo la clave `unahur_user`.

| Exportación | Descripción |
|---|---|
| `AuthProvider` | Provider que envuelve la app |
| `useAuth()` | Hook que devuelve `{ user, login, logout, isLoading }` |
| `login(userData)` | Setea el usuario y lo persiste en localStorage |
| `logout()` | Limpia el usuario y elimina de localStorage |
| `isLoading` | `true` mientras se restaura la sesión del localStorage al montar |

### `ThemeContext.tsx`
Maneja el tema claro/oscuro. Persiste en `localStorage` bajo `unahur_theme`.

| Exportación | Descripción |
|---|---|
| `ThemeProvider` | Provider que envuelve la app |
| `useTheme()` | Hook que devuelve `{ theme, toggleTheme }` |
| `toggleTheme()` | Alterna entre `"light"` y `"dark"` |
| Inicialización | Lee de localStorage o `prefers-color-scheme`; agrega/remueve clase `dark` en `<html>` |

### `ToastContext.tsx`
Sistema de notificaciones toast (alertas visuales).

| Exportación | Descripción |
|---|---|
| `ToastProvider` | Provider que envuelve la app |
| `useToast()` | Hook que devuelve `{ toasts, addToast, removeToast }` |
| `addToast(type, message)` | Agrega notificación (se autoelimina a los 4s) |
| `removeToast(id)` | Elimina notificación manualmente |
| `type` | `"success"` · `"error"` · `"info"` |

---

## `src/hooks/` — Custom Hooks

### `usePosts.ts`
Hook para obtener todos los posts.

| Exportación | Descripción |
|---|---|
| `usePosts()` | Devuelve `{ posts, isLoading, error }`. Llama a `postService.getPosts()` al montar. |

---

## `src/lib/` — Utilidades

### `utils.ts`
| Exportación | Descripción |
|---|---|
| `cn(...inputs)` | Combina `clsx` + `tailwind-merge` para componer clases Tailwind sin conflictos |

---

## `src/routes/` — Rutas

### `ProtectedRoutes.tsx`
Guarda rutas que requieren autenticación.

| Comportamiento | Descripción |
|---|---|
| `isLoading` | Muestra spinner |
| No autenticado | Redirige a `/login` |
| Autenticado | Renderiza `<Outlet />` (rutas hijas) |

---

## `src/components/layout/` — Layout

### `LayoutWrapper.tsx`
Estructura principal de la aplicación. Renderiza el shell completo según si el usuario está logueado o no.

**No autenticado:** Barra superior minimalista con logo, toggle de tema y botones de Sign in/Sign up.

**Autenticado:**
- **Sidebar izquierdo** (oculto en mobile, iconos en sm → texto en lg): logo, navegación (Home, Post, Perfil), toggle de tema, botón Logout
- **Contenido central**: renderiza las rutas anidadas (`children`)
- **Sidebar derecho** (solo lg+): `FeaturedPosts` + tarjeta "Invitá amigos"
- **Nav inferior** (solo mobile): barra fija con íconos de navegación + toggle de tema
- Renderiza `<ToastContainer />` globalmente

---

## `src/components/features/` — Componentes de funcionalidad

### `PostCard.tsx`
Renderiza un post individual en el feed o en detalle.

| Prop | Tipo | Descripción |
|---|---|---|
| `post` | `Post` | Datos del post a mostrar |
| `isDetail` | `boolean?` | Modo detalle (texto más grande, sin hover, sin "Ver más") |
| `onDelete` | `(postId) => void?` | Callback al eliminar |

**Funcionalidades:**
- Avatar + nickname del autor (linkeable al perfil)
- Timestamp relativo (`date-fns` con locale español)
- Descripción del post (más grande en modo detalle)
- Tags como chips clickeables (#formato)
- Imagen del post (primera imagen)
- Botones: Comentar (con contador), Repostear, Like (localStorage con clave `unahur_post_likes`), Compartir
- Botón "Ver más →" (solo en feed) navega a `/post/:id`
- Botón de eliminar (solo dueño) abre `Dialog` de confirmación

### `CommentItem.tsx`
Renderiza un comentario con opciones de edición y eliminación.

| Prop | Tipo | Descripción |
|---|---|---|
| `comment` | `Comment` | Datos del comentario |
| `onUpdate` | `(commentId, text) => void?` | Callback al editar |
| `onDelete` | `(commentId) => void?` | Callback al eliminar |

**Funcionalidades:**
- Avatar + nickname (link al perfil) + timestamp relativo
- Modo edición inline (input + check/cancel)
- Eliminación con confirmación visual
- Notificaciones toast en éxito/error

### `FeaturedPosts.tsx`
Widget de sidebar que muestra 3 posts aleatorios.

**Comportamiento:**
- Al montar, obtiene todos los posts, los mezcla aleatoriamente y toma 3
- Muestra skeleton loader mientras carga
- Cada ítem: avatar, título del post, nickname
- Link a `/post/:id`
- No se renderiza si no hay posts

### `SearchUsers.tsx`
Buscador de usuarios con autocompletado.

**Comportamiento:**
- Input con debounce de 300ms
- Filtra usuarios localmente desde `api.getUsers()`
- Dropdown con avatar + nickname + @handle
- Click navega al perfil del usuario
- Click fuera del dropdown lo cierra
- Botón para limpiar la búsqueda

---

## `src/components/ui/` — Componentes base reutilizables

### `Avatar.tsx`
| Componente | Descripción |
|---|---|
| `Avatar` | Contenedor circular (`forwardRef`) |
| `AvatarImage` | `<img>` con aspect-square y object-cover |
| `AvatarFallback` | Iniciales con fondo gradiente (indigo → purple) |

### `Button.tsx`
| Prop | Valores | Descripción |
|---|---|---|
| `variant` | `default` · `destructive` · `outline` · `secondary` · `ghost` · `link` | Estilo visual |
| `size` | `default` · `sm` · `lg` · `icon` | Tamaño |

### `Card.tsx`
Contenedor con subcomponentes: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. Estilo: rounded-2xl, border, shadow, bg white.

### `Dialog.tsx`
Modal de confirmación. Renderiza con `createPortal` directamente en `document.body`.

| Prop | Descripción |
|---|---|
| `isOpen` | Controla visibilidad |
| `onClose` | Cierra el modal |
| `title` | Título del modal |
| `description` | Mensaje de confirmación |
| `onConfirm` | Acción al confirmar |
| `confirmText` | Texto del botón confirmar (default: "Confirmar") |
| `cancelText` | Texto del botón cancelar (default: "Cancelar") |
| `variant` | `"default"` o `"destructive"` (cambia color del botón) |

**Características:**
- Fondo oscuro con blur (click para cerrar)
- Tecla ESC para cerrar
- Scroll del body deshabilitado mientras está abierto

### `Input.tsx`
Input de texto estilizado con `forwardRef`. Soportado en modo oscuro. Focus ring indigo.

### `Toast.tsx`
Renderiza las notificaciones toast.

**Comportamiento:**
- Lee del `ToastContext` y renderiza fixed en bottom-right (`z-[100]`)
- Cada toast: icono (CheckCircle / AlertCircle / Info), mensaje, botón cerrar
- Fondo coloreado según tipo (success/error/info)
- Entrada animada con `animate-scale-in`

---

## `src/pages/` — Páginas

### `Home.tsx`
Página principal. Alterna entre `LandingPage` y `FeedPage` según autenticación.

**LandingPage** (no autenticado):
- Hero animado con título gradiente "La red social anti-social."
- Subtítulo explicativo + CTAs (Crear cuenta / Iniciar sesión)
- Barra de estadísticas: 1,200+ Students, 8,400+ Posts, 0 Algoritmos
- Cards decorativas flotantes con posts falsos
- Marquee ticker animado ("Sin algoritmos / 100% universitario / Hecho a las 3am")
- Sección "Funcionalidades": 4 cards descriptivas
- Sección "Testimonios": 3 reseñas en glass cards
- Footer con branding y enlaces

**FeedPage** (autenticado):
- Header sticky con título + `SearchUsers`
- Barra de filtro por tags (scroll horizontal): "All" + tags desde API
- Feed infinito con `IntersectionObserver` (carga 10 posts por página)
- Posts renderizados con `PostCard`
- Estados: vacío, cargando, "Ya viste todo"

### `Login.tsx`
Página de inicio de sesión.

- Botones de login social: Google, Microsoft, GitHub (cada uno con su SVG)
- Formulario: nickname + contraseña (con toggle mostrar/ocultar)
- Banner de éxito si viene de registro (`?registered=true`)
- Mensajes de error con estilo
- Hint de credenciales demo
- Notificaciones toast en éxito/error

### `Register.tsx`
Página de registro.

- Botones de registro social (mismos que login)
- Formulario: nickname + contraseña + confirmar contraseña
- `PasswordStrength`: indicador visual de fortaleza (débil/media/fuerte)
- Indicador de coincidencia de contraseñas
- Estado de éxito con check + redirect a login tras 1.5s
- Notificaciones toast

### `PostDetail.tsx`
Vista detallada de un post con comentarios.

- Header con botón "atrás" + título "Post"
- `PostCard` en modo `isDetail`
- Input de comentario (solo si logueado; si no, botón para login)
- Lista de comentarios con `CommentItem`
- Operaciones de comentarios (crear/editar/eliminar) con actualización local + API
- Notificaciones toast

### `Profile.tsx`
Perfil de usuario (propio o de otro).

- Header con botón atrás, nickname, contador de posts, `SearchUsers`
- Banner gradiente (indigo → purple → pink)
- Avatar grande con iniciales
- **Perfil propio:** botones Logout y Eliminar cuenta (con diálogo de confirmación)
- **Otro perfil:** botón Follow / Unfollow
- Info: universidad (UnaHur), fecha de ingreso (Junio 2026), seguidores/siguiendo
- Tabs: Posts | Respuestas | Likes (solo Posts funcional)
- Lista de posts del usuario
- **Eliminar cuenta:** borra imágenes → posts → usuario → logout → redirect a register
- Notificaciones toast

### `CreatePost.tsx`
Creación de nueva publicación.

- Header con botón atrás, título, botón "Publicar"
- Avatar + textarea para descripción
- **URLs de imágenes:** input que agrega URLs al presionar Enter (ícono Link2)
- **Subida de archivo:** zona drag-and-drop o click para seleccionar; preview con botón remove
- **Tags:** chips de tags existentes desde API + input para tags nuevos (Enter)
- **Flujo de creación:**
  1. Crea tags nuevos que no existan
  2. Crea el post con IDs de tags
  3. Vincula cada URL de imagen al post via `POST /postImages`
  4. Sube el archivo seleccionado al post via `POST /postImages` (FormData)
  5. Toast de éxito y navega al perfil
- Notificaciones toast

---

## `src/index.css` — Estilos globales y animaciones

| Clase | Animación | Descripción |
|---|---|---|
| `.animate-float` | `float` 4s ease-in-out infinite | Flotación vertical suave |
| `.animate-float-delay` | `float-delay` 5s ease-in-out infinite 1s | Flotación con rotación y delay |
| `.animate-slide-up` | `slide-up` 0.6s ease forwards | Aparece desde abajo con fade |
| `.animate-scale-in` | `scale-in` 0.5s ease forwards | Aparece escalando desde 0.92 |
| `.animate-gradient` | `gradient-pan` 8s ease infinite | Gradiente animado en 300% |
| `.animate-marquee` | `marquee` lineal infinito | Texto tipo marquee/cinta |
| `.gradient-text` | — | Texto con gradiente indigo → purple → pink |
| `.glass-card` | — | Efecto vidrio: blur + fondo semitransparente + sombra |
| `.noise` | — | Overlay con textura noise SVG |
| `.scrollbar-hide` | — | Oculta scrollbar (cross-browser) |
| `.delay-100` a `.delay-500` | — | Delays de animación escalonados |

---

## `public/` — Archivos estáticos

| Archivo | Descripción |
|---|---|
| `favicon.svg` | Favicon con diseño de rayo / letra A en tonos púrpura |
| `icons.svg` | Sprite SVG con íconos: Bluesky, Discord, Documentation, GitHub, Social, X |

---

## Tecnologías principales

| Tecnología | Versión | Propósito |
|---|---|---|
| React | ^19.2.6 | UI declarativa por componentes |
| TypeScript | ~6.0.2 | Tipado estático |
| Vite | ^8.0.12 | Bundler y dev server |
| Tailwind CSS | ^4.3.1 | Estilos utilitarios |
| React Router | ^7.18.0 | Enrutamiento SPA |
| Lucide React | ^1.21.0 | Iconos SVG |
| date-fns | ^4.4.0 | Formateo de fechas |
| clsx + tailwind-merge | — | Composición de clases Tailwind |

---

## Convenciones del proyecto

- **Nombres de archivos:** PascalCase para componentes (`PostCard.tsx`), camelCase para servicios/hooks (`usePosts.ts`, `cliente.ts`)
- **Exports:** named exports para componentes en features/pages, default export para páginas de login/register
- **API:** toda comunicación pasa por el objeto `api` unificado en `cliente.ts`
- **Estilos:** Tailwind CSS v4 con dark mode via clase `.dark` en `<html>`
- **Like:** se almacena en `localStorage` con clave `unahur_post_likes` (sin endpoint backend)
- **Toast:** sistema global vía `ToastContext` + `ToastContainer` (animación scale-in)
