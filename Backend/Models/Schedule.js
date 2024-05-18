import mongoose from 'mongoose';
const { Schema } = mongoose;
const processSchema = new Schema({
    processtype: String,
    data: String,
    type: String,
  });
const scheduleSchema = new Schema({
    listnames: String,
    process: [processSchema],
    status: { type: String, default: 'pending' },
  });
export const Schedule = mongoose.model('Schedule', scheduleSchema);