export interface UserOption {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
