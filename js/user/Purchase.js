
import React,{useEffect,useState} from "react";
import { MessageBox2 } from "../General";
var db=firebase.firestore();
const hasActiveKey=async (uid)=>{
    const qsnap=await  db.collection('amalitech').doc('KeyManager_project').collection('keys')
    .where('uid','==',uid).where('status','==','active').where('type','==','k')
    .limit(1)
    .get()
    return  (qsnap.docs.length===1)
}
const onPurchase=async (e)=>{
    e.preventDefault();
    onPurchase.setActiveKey(s=>({...s,display:"show", state:"loading"}))
    const isActive=await hasActiveKey(onPurchase.user.uid);
  if(isActive){
  return   onPurchase.setActiveKey(s=>({...s,
    display:"show",state:"fulfilled",message:
    "cannot purchase a new active key until current active key expires"
   }))
  }
  const serial=(Math.random()*1e7).toString(6);
  const months= Number(document.getElementById('select-months').value);
 await db.collection('amalitech').doc('KeyManager_project').collection('activationIn')
    .doc(onPurchase.user.uid.substring(0,10))
    .set({
        m:months,
        operation:'activate',
        e:onPurchase.user.email,
        date:new Date(),
        user:onPurchase.user.uid,
        serial,
    },{merge:true});
 const listener=db.collection('amalitech').doc('KeyManager_project').collection('keys')
    //.doc(onPurchase.user.uid.substring(0,10))
    .where('uid','==',onPurchase.user.uid.substring(0,10))
   .where('serial','==',serial)
    .limit(1)
    .onSnapshot({
        next:(querySnap)=>{
            if(querySnap.docs.length===0)return;
            const docSnap=querySnap.docs[0];
            const data=docSnap.data();
           // if(serial!==data.serial )return;
            let message;
        if(data.r==='success'){
           message='operation successful for'+data.e
           +`\n New Key: ${data.key}`
           +`\n Procurement Date: ${data.p_date}`
           +`\n Expiry Date: ${data.e_date}`;
        }
        else {
            message="operation fail for "+data.e;
        }
            onPurchase.setActiveKey(s=>({...s,message,state:'fulfilled'}));
            listener()

        },error:(e)=>{
            console.log(e);
            onPurchase.setActiveKey(s=>({...s,message:'system error occurred',state:'fulfilled'}));
            listener()

        }
    })
}
export const PurchaseButton=({user})=>{
    const [activeKey,setActiveKey]=useState({state:null,key:null})
onPurchase.user=user;
onPurchase.setActiveKey=setActiveKey;
    return <>
    <MessageBox2 state={activeKey.state}   display={activeKey.display} 
    message={activeKey.message}  change={setActiveKey} />
    <div className="w3-panel w3-container w3-card-4 w3-center w3-round-xlarge w3-margin w3-light-grey w3-animate-left" 
    style={{maxheight:400,maxWidth:400}}>
        <form onSubmit={onPurchase}>
        <div className="w3-container">
        <p>Choose the number of months: </p>
        <select id="select-months" required>
            <option value="1" >1 MONTH</option> <option value="2" >2 MONTHS</option>
            <option value="3" >3 MONTHS</option> 
        </select></div>
        <div className="w3-container">
        <p>To purchase a new access key Click "Purchase"</p>
        <div style={{textAlign:"center"}}>
        <button  className="w3-btn w3-large w3-blue" 
         type="submit" >Purchase</button>
        </div></div></form>
    </div>
    </>
}