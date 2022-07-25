'use strict';
const {Firestore}=require('@google-cloud/firestore')
const cors=require('cors')
// [START gae_node_request]
const express = require('express');
const {body,validationResult}=require('express-validator')
const app = express();
app.use(express.json())
app.use(express.urlencoded())
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.post('/amalitech/keyManager/CheckKeyStatus',cors(corsOptions),
body('email').isEmail(),
async (req, res) => {
  try{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
  return   res.status(400).send({errors:errors.array()})
  }
  const email=req.body.email;
  const db=new Firestore();
  const base_q= db.doc("amalitech/KeyManager_project").collection('keys')
  .where('e','==',email).where('type','==','k');
  const activeQSnap=await base_q.where('status','==','active').limit(1).get()
  if(!activeQSnap.empty){
    let {status,e_date,p_date,key}=activeQSnap.docs[0].data();
    e_date=e_date.toDate();
    p_date=p_date.toDate();
    return res.status(200).send({key,status,email,"Procurement date":p_date,
    "Expiry date":e_date});
  }
  
  return res.status(404).send({status:'No Active Key Found',email}).end();
}catch(e){
  console.log("error ocurrred")
  console.log(e)
  return res.sendStatus(500)
}
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} ${(new Date()).toLocaleString()}`);
  //console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request]

module.exports = app;
