import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();
const app=express();
app.use(helmet());app.use(express.json({limit:'20kb'}));
app.use('/api/',rateLimit({windowMs:15*60*1000,limit:12,standardHeaders:true,legacyHeaders:false}));
const required=['WHATSAPP_TOKEN','WHATSAPP_PHONE_NUMBER_ID','WHATSAPP_ADMIN_RECIPIENT'];
app.post('/api/enquiry',async(req,res)=>{
  const {name,phone,email,interest,message=''}=req.body||{};
  if(!name||!phone||!email||!interest)return res.status(400).json({error:'Please complete all required fields.'});
  if(required.some(k=>!process.env[k]))return res.status(503).json({error:'The WhatsApp Business Cloud API is not configured. Please contact Innovotix by phone or email.'});
  const body=`NEW INNOVOTIX WEBSITE ENQUIRY\nName: ${String(name).slice(0,100)}\nMobile: ${String(phone).slice(0,30)}\nEmail: ${String(email).slice(0,150)}\nInterest: ${String(interest).slice(0,100)}\nMessage: ${String(message).slice(0,1000)||'Not provided'}`;
  try{
    const url=`https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_VERSION||'v22.0'}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const api=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${process.env.WHATSAPP_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to:process.env.WHATSAPP_ADMIN_RECIPIENT,type:'text',text:{preview_url:false,body}})});
    const data=await api.json();if(!api.ok){console.error('WhatsApp API error',data);return res.status(502).json({error:'WhatsApp could not deliver this enquiry. Please use the phone or email contact details.'});}
    res.json({ok:true});
  }catch(error){console.error(error);res.status(500).json({error:'Unable to send enquiry right now.'});}
});
const port=process.env.PORT||3000;app.listen(port,()=>console.log(`Innovotix site listening on ${port}`));
