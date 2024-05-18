
import { config } from 'dotenv';
import connecttomongo from './db.js';
import express, { response, urlencoded } from 'express';
import cors from 'cors';
import { Schedule } from './Models/Schedule.js';
import { templates } from './Models/Template.js';
import { List } from './Models/List.js';
import bodyParser from 'body-parser';
import agenda from './Utils/agenda.js';
import sendMail from './Utils/mailer.js';


config()
connecttomongo()
const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"], // Include 'OPTIONS'
    allowedHeaders: "*", // Add any custom headers used in requests
    credentials: true, 
    })
  );
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get("/", (req,res)=>{
  res.json("hello i am mailmaster")
});
app.post("/save",async (req,res)=>{
  const password = "Narwar1978@"
  const username = "Balaji Computers"
  try {
    const hashed = await bcrypt.hash(password, saltRounds);
    const data = new AdminData({username, password: hashed});
    const response = await data.save();
    res.json({status: response})
  } catch (error) {
    res.status(404).json({err: error.message})
  }

});

app.post("/api/savetemplate", async (req,res)=>{
  const {name, text} = req.body
  try {
    const tempdata = new templates({name, text})
    const response =  await tempdata.save();
    
    res.status(200).json({status: response})
  } catch (error) {
      res.status(404).json({err: error.message})
  }
})
app.get("/api/fetchtemplate", async (req,res)=>{

  try {
    const tempdata = await templates.find({})
    
    res.status(200).json(tempdata)
  } catch (error) {
      res.status(404).json({err: error.message})
  }
})
app.get("/api/fetchlist", async (req,res)=>{

  try {
    const list = await List.find({})

    res.status(200).json(list)
  } catch (error) {
      res.status(404).json({err: error.message})
  }
})

app.post("/api/savelist", async (req,res)=>{
  const {name, emails} = req.body
  try {
    const  listdata = new List({name, emails})
    const response =  await listdata.save();
    
    res.status(200).json({status: response})
  } catch (error) {
      res.status(404).json({err: error.message})
  }
})

app.post("/verify",async (req,res)=>{
 
  const {username, password} = req.body

  try {
    const usercheck = await AdminData.findOne({username})
    if(usercheck){
      try {
          const checkpass = await bcrypt.compare(password,usercheck.password)
          if(checkpass){
            try {
            
              res.status(200).json({verified: true})
            } catch (error) {
              res.status(400).json({ message: error.message });
            }
           
          }else{
            res.status(200).json({verified: false})
          }
      } catch (error) {
        res.status(404).json({err: error.message})
      }
    }else{
      res.status(200).json({verified: false})
    }
  } catch (error) {
    res.status(404).json({err: error.message})
  }

});
app.post("/api/createschedule", async(req,res)=>{
  const { data } = req.body;
  const {listnames, process} = data
  try {
    listnames.forEach(async (element) => {
      try {
        console.log(element,process)
        const newSchedule = new Schedule({ listnames: element, process });
        await newSchedule.save();
        
        await agenda.now('process schedule', { scheduleId: newSchedule._id });
    
      } catch (error) {
    
       console.log("error bhe")
      }
      });
      res.status(200).json({success:true , scheduledata : data})
  } catch (error) {
    res.status(404).json({success: false})
  }
  

  
})
app.post("/api/sendmail",async (req,res)=>{
  try {
    const response = await sendMail("shashankdonbro@gmail.com, shashank27042003@gmail.com","New Email What a day","hello sir it's nice to dsfkj")
    res.status(200).json({status: response})
  } catch (error) {
    res.status(404).json({err: error.message})
  }
})
app.post("/api/visit", async (req,res)=>{
  try {
      const firstcount= await Counterschema.find({})
        const newcount = firstcount[0].counter+1
        console.log((newcount))
        const response  = await Counterschema.findOneAndUpdate({}, {counter: newcount})
    
      res.status(200).json({found : firstcount, changed: newcount, status: response})
  } catch (error) {
    res.status(404).json({err : error.message})
  } 
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

export default app;