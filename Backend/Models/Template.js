import mongoose from 'mongoose';
const { Schema } = mongoose;
const template = new Schema({
    name: String,
    text: String,
  });
export const templates = mongoose.model('Templates', template);