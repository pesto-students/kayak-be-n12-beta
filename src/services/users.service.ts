import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.users.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not a registered user");

    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "You're not a registered user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not a registered user");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `Your email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: any): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not a registered user");

    if (userData.email) {
      const findUser: User = await this.users.findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `Your email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    try {
      const updateUserById: User = await this.users.findByIdAndUpdate(userId, userData, { new: true });
      if (!updateUserById) throw new HttpException(409, 'You are not a registered user');

      return updateUserById;
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "You're not user");

    return deleteUserById;
  }
}

export default UserService;
