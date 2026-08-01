
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body() body: { username: string; password: string },
  ) {
    const valid = this.authService.validateAdmin(
      body.username,
      body.password,
    );

    if (!valid) {
      return {
        success: false,
        message: 'Invalid username or password',
      };
    }

    return {
      success: true,
      message: 'Login successful',
    };
  }
}
