import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import passport from 'passport';

class AuthRoute implements Routes {
  public path = '/api/v1';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.authController.signUp);
    this.router.post(`${this.path}/login`, this.authController.logIn);
    this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logOut);
    this.router.get(`${this.path}/auth/google`, passport.authenticate('google', { scope: ['email', 'profile'] }));

    this.router.get('/test', this.authController.test);
    this.router.patch(`${this.path}/activate/:token`, this.authController.activateAccount);
    this.router.post(`${this.path}/forgot-password`, this.authController.forgotPassword);
    this.router.patch(`${this.path}/reset-password/:token`, this.authController.resetPassword);
    this.router.get(`${this.path}/resend-activation-mail`, authMiddleware, this.authController.resendActivationLink);

    this.router.get(`${this.path}/auth/google/callback`, passport.authenticate('google'), this.authController.loginGoogle);
  }
}

export default AuthRoute;
