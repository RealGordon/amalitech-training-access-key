import React, { useEffect, useState } from "react";
import { BrowserRouter as Router,Routes,Route, Navigate, useNavigate } from "react-router-dom";
import { KeyHistory } from "./admin/KeyHistory";
import { UserKeys } from "./user/keysList";
import { PurchaseButton } from "./user/Purchase";
//import { FilesHistory } from "./admin/filehistory";
//import { Users } from "./admin/siteUsers";
import { Navigation ,MessageBox,IndexCardMenu} from "./General";
//import { Files } from "./users/files";
import { App,onLogout,startFunc } from "./init_app";
//import { AdminForm } from "./admin/adminform";
//import { EmailSender } from "./users/emailSender";
import  ReactDOM  from "react-dom";

const pageTest=/([a-zA-z0-9_/]+)\/([a-zA-Z]+).html$/;
const MainApp=()=>{
  
  const [user,setUser]=useState(null);
  const [error,setError]=useState(null);
  useEffect(()=>{
    initApp(startFunc);
    document.getElementById('id0l').style.display='none';
  },[])
  let page,base_url;
  const pageMatch=window.location.pathname.match(pageTest);
  onLogout.setUser=startFunc.setUser=setUser;
  startFunc.setError=setError;
 

  if (pageMatch){page=pageMatch[2];
    base_url=pageMatch[1];
    };
  const props={user,error,base_url}
  
 
return <Router onClick={onLogout} >
    <Navigation {...props} page={page}  />
    <MessageBox state={error?"on":"off"} message={error} />
    <Routes>
    <Route path={base_url}>
    <Route element={<IndexCardMenu page={page}  {...props}  />} path='index.html' />
    <Route element={<App  {...props} />}>
    {user && user.pos==='admin' && <Route path="admin" >
    [<Route element={<KeyHistory />} path='keyshistory.html' />,
    
    ]
    </Route>}
    {user && user.pos==='user' && <Route path="user" >
    [<Route element={<UserKeys user={user} />} path='keyslist.html' />,
    <Route element={<PurchaseButton user={user} />} path='purchase.html' />
    ]
    </Route>}
    </Route>
    </Route>
    <Route element={<Navigate to={`${base_url}/index.html`}  />}  path="*" />
    </Routes>
    </Router>

}


  const container=document.querySelector('#main-body');
  ReactDOM.render(<MainApp  />,container)
  