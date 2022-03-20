import { hash, compare } from 'bcrypt';
import config from 'config';
import { sign, verify } from 'jsonwebtoken';
import { CreateUserDto } from '@dtos/users.dto';
import { LoginUserDto } from '@dtos/login.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { Password, User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import MailService from './mail.service';

class AuthService {
  private users = userModel;
  private mailService = new MailService();

  /**
   * Signup
   * @param userData
   * @returns
   */

  public async signup(userData: CreateUserDto): Promise<{ user: User; tokenData: TokenData }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });
    const tokenData = this.createToken(createUserData);
    const heading = `Please verify your account using following token`;
    const buttonLink = `${process.env.FRONTEND_HOST_NAME}/auth/activate/${tokenData.token}`;

    const context = {
      buttonLink,
      heading,
      buttonTitle: 'Verify Account',
    };
    this.mailService.sendMail(userData.email, 'Account Verification', `auth-mail`, context);
    return { user: createUserData, tokenData };
  }

  /**
   * Login
   * @param userData
   * @returns
   */

  public async login(userData: LoginUserDto): Promise<{ cookie: string; findUser: User; tokenData: TokenData }> {
    if (isEmpty(userData)) throw new HttpException(400, 'No records found!');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `Your email ${userData.email} not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Your password not matching');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser, tokenData };
  }

  public async loginGoogle(userData: CreateUserDto): Promise<{ cookie: string; userData: User; token: TokenData }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) {
      const token = this.createToken(findUser);
      const cookie = this.createCookie(token);
      return { cookie, userData: findUser, token };
    }
    const createUserData: User = await this.users.create({ ...userData });
    const token = this.createToken(createUserData);
    const cookie = this.createCookie(token);
    return { cookie, userData: createUserData, token };
  }

  /**
   * Logout
   * @param userData
   * @returns
   */
  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    return findUser;
  }

  public async activateAccount(token: string): Promise<boolean> {
    const secretKey: string = config.get('secretKey');
    const verificationResponse = (await verify(token, secretKey)) as DataStoredInToken;
    const userId = verificationResponse._id;
    const findUser = await userModel.findById(userId);
    if (findUser) {
      await userModel.findByIdAndUpdate(userId, { verified: true });
      const heading = `Your Account verified Successfully`;
      const buttonLink = `${process.env.FRONTEND_HOST_NAME}/home`;
      const context = {
        buttonLink,
        heading,
        buttonTitle: 'Go Home',
      };
      this.mailService.sendMail(findUser.email, 'Account Verified', `auth-mail`, context);
      return true;
    }
    return false;
  }

  public async forgotPassword(email: string): Promise<User> {
    const findUser: User = await this.users.findOne({ email });
    if (!findUser) throw new HttpException(409, `Your email ${email} not found`);
    const tokenData = this.createToken(findUser);

    const buttonLink = `${process.env.FRONTEND_HOST_NAME}/auth/reset-password/${tokenData.token}`;
    const context = {
      buttonLink,
      heading: 'Please click on the button to reset password!',
      buttonTitle: 'Reset Password',
    };
    this.mailService.sendMail(email, 'Password Reset', `auth-mail`, context);
    return findUser;
  }

  public async resetPassword(passwordData: Password, token: string): Promise<User> {
    const secretKey: string = config.get('secretKey');
    const verificationResponse = (await verify(token, secretKey)) as DataStoredInToken;
    const userId = verificationResponse._id;
    const findUser = await userModel.findById(userId);

    if (passwordData.password !== passwordData.confirmPassword) {
      throw new HttpException(403, `New Password and Confirm password did not match!`);
    }

    const hashedPassword = await hash(passwordData.password, 10);
    await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
    const heading = `You Password is changed successfully. If it's not you please change your password now!`;
    const buttonLink = `${process.env.FRONTEND_HOST_NAME}/login`;
    const context = {
      buttonLink,
      heading,
      buttonTitle: 'Login',
    };
    this.mailService.sendMail(findUser.email, 'Password Reset Successful', `auth-mail`, context);
    return findUser;
  }

  public async resendActivationLink(email: string): Promise<void> {
    if (isEmpty(email)) throw new HttpException(400, 'Please provide email');

    const findUser: User = await this.users.findOne({ email });
    if (!findUser) throw new HttpException(409, `Email doesn't exists`);
    if (findUser.verified) throw new HttpException(409, `Email already verified`);

    const tokenData = this.createToken(findUser);
    const heading = `Please verify your account by clicking on the button below`;
    const buttonLink = `${process.env.FRONTEND_HOST_NAME}/auth/activate/${tokenData.token}`;
    const context = {
      buttonLink,
      heading,
      buttonTitle: 'Verify Account',
    };
    this.mailService.sendMail(findUser.email, 'Account Verification', `auth-mail`, context);
  }

  /**
   * Create Token
   * @param user
   * @returns
   */

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id, name: `${user.firstname} ${user.lastname}` };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = 60 * 60 * 24 * 30;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  /**
   * Create Cookie
   * @param tokenData
   * @returns
   */

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
