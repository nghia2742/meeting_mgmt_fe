import { Users } from '@/types/user.type';
import http from '@/utils/http';

export const getUsers = () => http.get<Users>('users');
