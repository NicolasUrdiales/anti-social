export interface User {
  id: string;
  nickName: string;
}

export interface Post {
  id: string;
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
