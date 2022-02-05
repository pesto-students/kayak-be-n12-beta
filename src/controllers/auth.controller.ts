import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { LoginUserDto } from '@dtos/login.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { user, tokenData } = await this.authService.signup(userData);
      user.password = undefined;
      user.__v = undefined;
      res.status(201).json({ data: user, tokenData, message: 'Signup successful!' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginUserDto = req.body;
      const { cookie, findUser, tokenData } = await this.authService.login(userData);
      res.setHeader('Set-Cookie', [cookie]);
      findUser.password = undefined;
      findUser.__v = undefined;
      res.status(200).json({ data: findUser, message: 'Login successful!', tokenData });
    } catch (error) {
      next(error);
    }
  };

  public test = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public loginGoogle = async (req: any, res: Response, next: NextFunction) => {
    try {
      const userData: User = {
        firstname: req?.user?.given_name,
        lastname: req?.user?.family_name,
        googleId: req?.user.id,
        email: req?.user?.email,
        picture: req?.user?.picture,
        type: 'oauth',
        verified: true,
      };

      const { cookie, userData: user, token } = await this.authService.loginGoogle(userData);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: user, message: 'Login successful!', tokenData: token });
    } catch (error) {
      next(error);
    }
  };

  public activateAccount = async (req: any, res: Response, next: NextFunction) => {
    try {
      const token = req.params.token;
      const isActivated = await this.authService.activateAccount(token);
      if (isActivated) {
        res.status(200).json({ data: null, message: 'Account activated successfully!' });
      }
      res.status(401).json({ data: null, message: 'Cannot activate account!' });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: any, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res.status(200).json({ data: null, message: `A reset Password link sent to the ${email}` });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: any, res: Response, next: NextFunction) => {
    try {
      const { password, confirmPassword } = req.body;
      const { token } = req.params;
      await this.authService.resetPassword({ password, confirmPassword }, token);
      res.status(200).json({ data: null, message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  };

  public resendActivationLink = async (req: any, res: Response, next: NextFunction) => {
    try {
      const { email } = req.query;
      await this.authService.resendActivationLink(email);
      res.status(200).json({ data: null, message: `Activation email sent successfully to ${email}` });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
