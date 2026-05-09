import mongoose from "mongoose";
import { UserModel } from "../server/models/User";

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:62512/');
  await UserModel.updateOne({ email: 'test@example.com' }, { role: 'admin' });
  console.log('User promoted to admin');
  await mongoose.disconnect();
}
run();
