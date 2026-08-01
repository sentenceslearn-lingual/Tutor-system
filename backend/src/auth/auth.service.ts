import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateAdmin(username: string, password: string): boolean {
    return (
      username === 'Admin' &&
      password === 'Admin30050407TP'
    );
  }
}