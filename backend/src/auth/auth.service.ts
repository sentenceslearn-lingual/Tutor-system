
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateAdmin(username: string, password: string): boolean {
    return username === 'admin' && password === 'admin123';
  }
}
