// --------------- USER ----------------
export interface User {
  id: string;
  nickName: string;
  password: string;
  followers: string[];
  following: string[];
}
export interface UserDetail extends Omit<User, 'followers'> {
  followers: {id:string, nickName:string}[];
  posts: Post[];
  comentarios: Comment[];
}
export interface CreateUserRequest {
  nickName: string;
  password: string;
}

// --------------- POST ----------------
export interface PostTag {
  _id: string;
  name: string;
}


export interface Post {
  id: string;
  userId: string;
  user: User;
  description: string;
  images: {url: string}[];
  tags: PostTag[];
  createdAt: string;
  comments: Comment[];
}

export interface CreatePostRequest {
  description: string;
  user: string;
  images?: {url: string}[];
  tags?: string[];
}


// --------------- COMMENT ----------------

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  postId: string;
  userId: string;
  text: string;
}

//--------------- TAG ----------------

export interface Tag {
  id: string;
  name: string;
}
 //--------------- POST IMAGES ----------------

export interface PostImage {
  id: string;
  url: string;
  post: string;
}