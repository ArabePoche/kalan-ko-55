
export interface VideoComment {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  isLiked?: boolean;
  replies?: VideoComment[];
}
