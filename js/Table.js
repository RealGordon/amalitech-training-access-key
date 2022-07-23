import {TabulatorFull as Tabulator} from "tabulator-tables"; //import Tabulator library
//import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet
import React from "react";
export class Table extends React.Component {
   
  static  tabulator=null;
  static el=React.createRef();
  

  componentDidMount() {
    //instantiate Tabulator when element is mounted
    const tabulator = new Tabulator(Table.el.current, {
        layout:"fitColumns",
        height:"80%",
      data: this.props.tableData, //link data to table
      reactiveData:true, //enable data reactivity
      columns: this.props.columns, //define table columns
      placeholder:"No Data Available", //didisplay message to user on empty tabl
    });
   this.setTableEvents(tabulator);
    Table.tabulator=tabulator
}
componentDidUpdate(){
    const tabulator = new Tabulator(Table.el.current, {
        layout:"fitColumns",
        height:"80%",
      data: this.props.tableData, //link data to table
      reactiveData:true, //enable data reactivity
      columns: this.props.columns, //define table columns
      placeholder:"No Data Available", //didisplay message to user on empty tabl
    });
   this.setTableEvents(tabulator);
    Table.tabulator=tabulator
}
shouldComponentUpdate(nextProps, nextState){
 if(this.props.update===nextProps.update){
    return false
}
Table.tabulator.replaceData(nextProps.tableData)
return false;

}
    
  
setTableEvents(tabulator){
  const events=this.props.events;
  const eArr=Object.keys(events);
  if(eArr.length!==0){
   for( const key of eArr ){
    tabulator.on(key, events[key]);
   }
   
  }
}
  //add table holder element to DOM
  render(){
    return (
   
    <div   ref={Table.el} />

    );
  }
}