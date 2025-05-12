import { User } from './interfaceUser';

export interface AuthResponse {
  user: User;
  token: string;
}
