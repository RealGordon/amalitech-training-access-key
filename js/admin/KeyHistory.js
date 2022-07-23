//manually revoke a key
import React,{useState, useEffect } from "react";
import { MessageBox2} from "../General";
import { Table } from "../Table";
//const { useState, useEffect } = React;
const columns=[{title:'Email',field:'e',hozAlign:'left'},
{title:"Key",field:"key"},
{title:"Status",field:"status"},
{title:"Procurement Date",field:"p_date",sorter:"datetime"},
{title:"Expiry Date",field:"e_date",sorter:"datetime"}
]
var db;
function loadFiles(func){
db=firebase.firestore();
db.collection('amalitech').doc('KeyManager_project').collection('keys')
.limit(20)
.get()
.then((qsnap)=>{
  func(s=>({...s,docs:qsnap.docs.map((v)=>{
    const data=v.data();
    data.uref=v.ref;
    data.ukey=data.key;
    data.e_date=data.e_date.toDate();
    data.p_date=data.p_date.toDate();
    return data;
  }),
    update:s.update+1,
    status:'fulfilled'}));
  
})
}
const recordDownload=(docId)=>{
db.collection('files').doc(docId).update(
  {downloads:firebase.firestore.FieldValue.increment(1)})
  
}
export const KeyHistory=()=>{
  const [Docs,setDocs]=useState({docs:[],status:'pending',update:0});
  const [line,setLineDetail]=useState({display:'hide'});
  
const {docs,status}=Docs;
useEffect(()=>{
 
  loadFiles(setDocs)
  
},[])

  
revokeKey.setLineDetail= rowClickHandler.setLineDetail=setLineDetail;
revokeKey.setDocs=setDocs;
revokeKey.docs=rowClickHandler.docs= docs;
return <>
<MessageBox2  state={status} display={Docs.display}  
message={Docs.message} change={setDocs} />
<MessageBox2 key='productDetail'  
change={setLineDetail}  size="m" 
      display={line.display} state={line.state}
      buttons={line.buttons && <DetailButtons change={setLineDetail} 
      detail={line.data}  />}   
      component={<Detail   {...line.data} />} 
      />
<Table   columns={columns} tableData={docs}  
    events={{rowDblClick:rowClickHandler }}
    options={{height:"80%"}} 
    update={Docs.update}  />
    </>

 
}

const rowClickHandler =(e,row)=>{
  const {key,status}=row.getData();
  const buttons=(status==='active'|| status==='revoked');
  
const data=rowClickHandler.docs.find((v)=>{
  return key===v.key
});
if(data.revokedTime && data.revokedTime.toDate){
  data.revokedTime=data.revokedTime.toDate()
}
 rowClickHandler.setLineDetail(s=>({...s,data:({...data}),display:"show",
 buttons}))
}


const DetailButtons=({detail})=>{

  const CartProcessing2=()=>{
    revokeKey(detail);
    //props.change(s=>({...s,display:'hide'}));
    }

    return (
     [<button onClick={CartProcessing2} key="1" 
      className="w3-bar-item w3-margin-right w3-btn w3-blue">{detail.status==='active'?
        'Revoke':'Activate'}</button>]
    )
}

const Detail=(props)=>{

  return (<>
<p>Email: {props.e}</p>
<p>Access Key: {props.ukey}</p>
<p>Status: {props.status}</p>
<p>Procument Date: {props.p_date.toLocaleString()}</p>
<p>Expiry Date: {props.e_date.toLocaleString()}</p>
{props.revokedTime && props.status==='revoked'   &&
<p>Revoked Date: {props.revokedTime
.toLocaleString()}</p>}
</>
  )
}

const revokeKey=async (detail)=>{
try{
  /*
  const qsnap= await  db.collection('amalitech').doc('KeyManager_project')
  .collection('keys').where('key','==',detail.key).where('e','==',detail.e)
  .get()
  const doc= qsnap.docs[0];
  */
revokeKey.setLineDetail(s=>({...s,state:"loading",buttons:null}));
 const doc=revokeKey.docs.find((v)=>{
return (v.ukey===detail.key)
 });
 if(!doc) return revokeKey.setLineDetail(s=>({...s,display:"show",state:"fulfilled",
 message:"error occurred"}));
 
 const updateText={status:'revoked',revokedTime:new Date()};
 if(doc.status==='revoked') {updateText.status='active';
delete updateText.revokedTime;
}
const operation=(doc.status==='revoked')?'activate':'revoke';
 const updateResult= await doc.uref.update({...updateText})
 revokeKey.setLineDetail(s=>({...s,display:"hide",state:'fulfilled'}));
 revokeKey.setDocs(s=>({...s,update:s.update+1,docs:s.docs.map((v)=>{
  if(v.key===detail.key){
    return ({...v,...updateText})
  }
  return v
}),status:'fulfilled',
display:"show",message:(`${operation} successful for ${doc.e}`)}));

} catch(e){
  console.log(e)
  revokeKey.setLineDetail(s=>({...s,display:"show",state:'fulfilled',
  message:("operation fail for "+doc.e)}))
}
  /*
  const batch=db.batch();
  const keyRef=db.collection('files').doc();
  const userFilesRef=db.collection('users').doc(id.substring(0,10)).collection(
    'files').doc(fileRef.id);
  batch.set(fileRef,{...metadata})
  delete metadata['uid'];
  batch.set(userFilesRef,{...metadata,AdminFileId:fileRef.id})
  return batch.commit()*/
  
}