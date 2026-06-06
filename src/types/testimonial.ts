export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  avatarPath: string | null;
  visible: boolean;
  createdAt: string;
}
