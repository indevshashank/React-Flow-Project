import Agenda from 'agenda';
import mongoose from 'mongoose';
import { List } from '../Models/List.js';
import { templates } from '../Models/Template.js';
import sendMail from './mailer.js';
import { config } from 'dotenv';
import { Schedule } from '../Models/Schedule.js';

config(); // Load environment variables
const agenda = new Agenda({ db: { address: process.env.MONGODB_URI } });

agenda.define('send email', async (job) => {
  const { listname, subject, text } = job.attrs.data;
  const list = await List.findOne({ name: listname });
  if (list) {
    await sendMail(list.emails, subject, text);
  }
});

agenda.define('process schedule', async (job) => {
  const { scheduleId, processIndex = 0 } = job.attrs.data;
  const schedule = await Schedule.findById(scheduleId);

  if (schedule && processIndex < schedule.process.length) {
    const currentProcess = schedule.process[processIndex];
    const nextProcessIndex = processIndex + 1;

    if (currentProcess.processtype === 'email') {
      let subject;
      if (currentProcess.type === 'new email') {
        subject = 'New Email Subject'; // Customize as needed
      } else if (currentProcess.type === 'follow up') {
        subject = 'Follow-Up Email Subject'; // Customize as needed
      }
      const temptext = await templates.findOne({name: currentProcess.data})
      console.log(schedule.listnames, subject, temptext.text)
      await agenda.now('send email', { listname: schedule.listnames, subject, text: temptext.text });
      if (nextProcessIndex < schedule.process.length) {
        await agenda.now('process schedule', { scheduleId, processIndex: nextProcessIndex });
      }
    } else if (currentProcess.processtype === 'wait') {
      const waitTime = parseInt(currentProcess.data, 10);
      const waitUnit = currentProcess.type.toLowerCase();
      console.log(`in ${waitTime} ${waitUnit}`) // 'days', 'hours', etc.
      await agenda.schedule(`in ${waitTime} ${waitUnit}`, 'process schedule', { scheduleId, processIndex: nextProcessIndex });
    }
    if (nextProcessIndex >= schedule.process.length) {
      schedule.status = 'completed';
      await schedule.save();
    }
  }
});

(async function () {
  await agenda.start();
})();

export default agenda;