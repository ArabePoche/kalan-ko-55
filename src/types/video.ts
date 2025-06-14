
export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  video_type: 'promo' | 'educational' | 'testimonial';
  likes_count: number;
  comments_count: number;
  views_count: number;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
  };
  product?: {
    id: string;
    price: number;
  };
  isLiked?: boolean;
}
