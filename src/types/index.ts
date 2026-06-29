export interface User {
  _id: string;
  nickName: string;
  name?: string;
}

export interface Post {
  _id: string;
  userId: string;
  user: User;
  description: string;
  images: string[];
  tags: string[];
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface Tag {
  _id: string;
  name: string;
}
