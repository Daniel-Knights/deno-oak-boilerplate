import { Model, DataTypes, Relationships } from '../config/deps.ts';

import User from './User.ts';

class Post extends Model {
  static table = 'posts';
  static timestamps = true;

  static fields = {
    _id: { primaryKey: true },
    text: DataTypes.STRING,
    author: Relationships._belongsToField(User),
  };
}

export default Post;
