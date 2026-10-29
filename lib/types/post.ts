export interface Author {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

export interface Post {
  id: string;
  title: string;
  author: Author;
  content: string;
  createdAt: string;
}
