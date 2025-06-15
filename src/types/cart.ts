
export interface CartItem {
  id: string;
  title: string;
  price: number;
  instructor: string;
  image: string;
  type: 'formation' | 'article' | 'service';
  quantity: number;
}
