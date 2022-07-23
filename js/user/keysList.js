import React,{useState,useEffect} from "react";
import { SpinnerLoader,MessageBox2 } from "../General";
import { useOutletContext } from "react-router-dom";
//const { useState, useEffect } = React;
import { Table } from "../Table";
const db=firebase.firestore();
const columns=[
{title:"Key",field:"key"},
{title:"Status",field:"status"},
]
export function loadFiles(func,uid){

db.collection('amalitech').doc('KeyManager_project').collection('keys')
.where('uid','==',uid)
.where('type','==','k')
.limit(20)
.get()
.then((qsnap)=>{
  func(s=>({...s,docs:qsnap.docs.map((v)=>{
    const data=v.data();
    data.ukey=data.key;
    //data.ref=v.ref;
    return data;
  }),
  update:s.update+1,
    status:'fulfilled'}));
  
})
}

export const UserKeys=(props)=>{
  //const [Docs,setDocs]=useState({docs:[],status:'pending',update:0});
  const [line,setLineDetail]=useState({display:'hide'});
  const {keyDocs:Docs}=useOutletContext();
  
const {docs,status}=Docs;
/*
useEffect(()=>{
 
  loadFiles(setDocs,props.user.uid)
  
},[]);
*/
rowClickHandler.docs=docs;
rowClickHandler.setLineDetail=setLineDetail;
return <>
{[<MessageBox2 key="1"  state={status}  />,
<MessageBox2 key='productDetail'  size="m" 
change={setLineDetail}  
      display={line.display} state={line.state}
      buttons={line.buttons && <DetailButtons change={setLineDetail} 
      detail={line.data}  />}   
      component={<Detail   {...line.data} />} 
      />]}
<Table   columns={columns} tableData={docs}  
    events={{rowDblClick:rowClickHandler }}
    options={{height:"80%"}} 
    update={Docs.update}
    /></>
}
//const container=document.getElementById('file-list');
//const LocalComponent=Files;
const rowClickHandler =(e,row)=>{
  const {key}=row.getData();
  
 const data=rowClickHandler.docs.find((v)=>{
  return v.key===key
  })
  if(!data)return;
 rowClickHandler.setLineDetail(s=>({...s,data:({...data}),display:"show",buttons:null}))
}

const Detail=(props)=>{

  return (<>
<p>Email: {props.e}</p>
<p>Access Key: {props.ukey}</p>
<p>Status: {props.status}</p>
<p>Procument Date: {props.p_date.toDate().toLocaleString()}</p>
<p>Expiry Date: {props.e_date.toDate().toLocaleString()}</p>
</>
  )
}