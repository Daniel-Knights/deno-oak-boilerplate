import { Model, DataTypes } from '../config/deps.ts';

class User extends Model {
  static table = 'users';
  static timestamps = true;

  static fields = {
    _id: { primaryKey: true },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  };
}

export default User;
