const {Firestore} =require('@google-cloud/firestore');

const { DateTime }=require("luxon");
exports.newKeyPurchase= async (event, context) => {
   
     const firestore = new Firestore();
     const fields=event.value.fields;
     const userUID=fields.user.stringValue;
     const operation=fields.operation.stringValue;
     const serial=fields.serial.stringValue;
     const email=fields.e.stringValue;
     const months=fields.m.integerValue;
   
     try{
     const  oldqueryDoc= await firestore.doc(
        'amalitech/KeyManager_project').collection('keys')
        .where('uid','==',userUID).where('status','==','active').get();
     if(!oldqueryDoc.empty)return;
      
    
     if(operation!=='activate')return null;
    const newDoc= firestore.doc(
        'amalitech/KeyManager_project').collection('keys').doc();
        const dt=DateTime.now();
        const p_date=new Date(dt.toISO());
        const e_date=new Date(dt.plus({months:months}).toISO())

        await newDoc.set({
            key:newDoc.id,
           uid: userUID,
        status:'active',
        serial,
       e:email,
       e_date,
       p_date,
        })
     
  
      
      
        } catch (e) {
        await firestore.doc(
          'amalitech/KeyManager_project').collection('keys').doc(userUID.substring(0,10))
          .set({o:operation, time: new Date(),r:'fail',s:serial });
          console.log(`error occurred while ${operation} account key for ${email}`);
          console.log(e)
        }
        return null;
    
  
  
  };
