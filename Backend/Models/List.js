import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  name: String,
  emails: String,
});
export const List = mongoose.model('List', listSchema);