import mongoose from 'mongoose';
import { Password } from './../services/password';
//đây là interface để mô tả các thuộc tính của user model
interface UserAttrs {
  email: string;
  password: string;
}
//interface mô tả các thuộc tính user doc
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  next();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };