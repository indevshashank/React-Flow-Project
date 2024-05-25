import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  getConnectedEdges,

} from "reactflow";
import "reactflow/dist/style.css";


import "./btnstyle.css";

import "./styles.css";

import newnoder from "./newnode";

import Plusnode from "./Addnodestyle";
import TextNode from "./Textnode";
import Listmodal from "./Listmodal";
import Processmodal from "./Processmodal";
import ProcessNode from "./ProcessNode";
import EditModal from "./EditModal";
import EditListModal from "./EditListModal";


const newnode = {
  Newnode: newnoder,
  plusNode : Plusnode,
  Textnode: TextNode,
  processnode: ProcessNode
};





let nodeid = 0;



const initialEdges = [{ id: 'e2-e1000', source: '2', target: '1000'}];

const getId = () => `dndnode_${nodeid++}`;


//NOTE The Main Component
const Flow = () => {
  
  // NOTE All States
  const [prevplus , setPrevplus] = useState({edgeid: "e2-e1000", source: "2", target: "1000" ,height: 220})
  const [cart, setCart] = useState({listnames: "", process: []})
  const [listmodal, setListmodal]= useState(false)
  const [selectedEdges, setSelectedEdges] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState(null);
  const [edges, setEdge, onEdgesChange] = useEdgesState(initialEdges);
  const [procmodal, setProcmodal] = useState(false)
  const [editmodal, setEditmodal] = useState(null)
  const reactflowbox = useRef();
  const [savestatus, setSavestatus] = useState(null)
  const [reactflowinstance, setReactflowinstance] = useState(null);
  const [doc, setDoc] = useState(null);
  const [mtrigger, setMtrigger]= useState(false);
  const [remtrigger, setRemtrigger] = useState({id: "123123"})
  const [editrigger,setEditrigger] = useState(false)
  const openlistmodal = ()=>{
    setListmodal(true)
  }
 useEffect(() => {
  if(cart.listnames && mtrigger){
    setProcmodal(true)
    setMtrigger(false)
  }
 }, [cart,mtrigger])
 const editlist =()=>{
console.log("edt called")
setEditrigger(true)
 }

  const openproc = ()=>{
    setMtrigger(true)
  }
  const initialnode = [
    {
      id: "1",
      type: "Newnode",
      position: {x:0, y :0},
      data: {
      openlistmodal : openlistmodal, editlist:  editlist, endlist : endlist, listnames: []},
    },
    {
      id: "2",
      type: "Textnode",
      position: {x:0, y :220},
    },
    {
      id: "1000",
      type: "plusNode",
      position: {x:75, y :320},
      data:{openproc: openproc}
    },
    
  
  ];

  const [nodes, setNode, onNodesChange] = useNodesState(initialnode);

  function endlist (){
    setPrevplus({edgeid: "e2-e1000", source: "2", target: "1000" ,height: 220})
     setCart({listnames: "", process: []})

     setNode(initialnode)
     setEdge(initialEdges)
    }
  useEffect(() => {}, [selectedNodes,doc]);
  useEffect(() => {}, [selectedEdges]);

  const closepros=()=>{
    setProcmodal(false)
  }

  const onConnect = useCallback(
    (params) => {
      if (params.source !== params.target) {
        setEdge((eds) => addEdge(params, eds));
      }
    },
    []
  );




 // Event handler to prevent node movement on drag start
 const onNodeDragStart = (event, node) => {
  event.preventDefault();
};



// Event handler to prevent node movement on drag stop
const onNodeDragStop = (event, node) => {
  event.preventDefault();
};
useEffect(() => {
console.log(cart)
}, [cart])


const closelist = ()=>{setListmodal(false)} 
const changelist = (id, newLabel,editl) => {

  let firstcart = {...cart, listnames: newLabel}
  if(editl){setCart((prev)=>{ return {...prev, listnames: newLabel}})}else{
    setCart(firstcart)
  }

  setNode((nds) =>
    nds.map((node) => {

      if (node.id === id) {
 
        return {
          ...node,
          data: {
            ...node.data,
            listnames: [newLabel],
          },
        };
      }
      return node;
    })
  );
  setEdge((ed) => [...ed, {id:"e1-e2", source: "1", target:"2"}])
};
useEffect(() => {
  if(cart.process.length>0){
    const previndex= edges.findIndex((item)=>item.target===remtrigger.id )
    const postindex= edges.findIndex((item)=>item.source===remtrigger.id )
    const newedges = [...edges];
// Sorting indices in descending order
let indices = [previndex, postindex];
indices.sort((a, b) => b - a);  // Sort indices in descending order

// Removing elements starting from the highest index
indices.forEach(index => newedges.splice(index, 1));
    const newsource = edges[previndex].source
    const newtarget = edges[postindex].target
    const newedge = {id: `e${newsource}-e${newtarget}`, source: newsource, target: newtarget};
console.log("new edge formed",newedge)
    const finaledgelist = [...newedges, newedge];

    setEdge(finaledgelist);
    setNode((nds) => nds.filter((node) => node.id !== remtrigger.id));
    setNode((prev)=>prev.map((item)=>{if(Number(item.id)>Number(newsource)){
      return {...item, position:{x:item.position.x,y:item.position.y-150}}
    }else{return item}}))
    const lastindex= finaledgelist.findIndex((item)=>item.target==="1000" )
    console.log("list", finaledgelist, "index", lastindex)
    const prev={edgeid: `e${finaledgelist[lastindex].source}-e1000`, source:finaledgelist[lastindex].source, target: "1000B", height: prevplus.height-150}
    setPrevplus(prev)
    
    const processnew = cart.process.filter((item)=>item.id !== remtrigger.id)
    const listnames = cart.listnames;
    const newcart = {listnames, process: processnew}
    setCart(newcart)}
}, [remtrigger])

const remove = useCallback((id)=>{
  //setEdge((eds) => eds.filter((edge) => edge.id !== ));
  let remid = {id: id}
  setRemtrigger(remid)
  // setNode((nds)=>nds.filter((item)=>item.id !== id))
},[cart])
const edit = useCallback((id)=>{
  setEditmodal(id)

},[cart])
const closeedit = ()=>{
  setEditmodal(null)
}

//NOTE - Updateing node function

const update = (id,processdata, modal, type)=>{
  const processnew = cart.process.map((item)=>{if(item.id === id){ return {...item, data: processdata, type}}else{return item}})
    const listnames = cart.listnames;
const newcart = {listnames, process: processnew}
console.log(newcart,processnew)
setCart(newcart)
  setNode((prev)=>prev.map((item)=>{if(item.id===id){
    return {...item, data: {...item.data, content: processdata , type: type}}
  }else{return item}}))
}


//NOTE return
  const tempdone = (processdata, modal, type)=>{

    const prevsource = prevplus.source
    const id = `${Number(prevsource)+1}`
    if (modal=== "email"){
      let newcart = {...cart,process: [...cart.process, {processtype : modal, data: processdata, type, id}] }
      setCart(newcart)
  }else if (modal === "wait"){
      let newcart = {...cart,process: [...cart.process, {processtype : modal, data: processdata, type, id}] }
      setCart(newcart)
  }
    const newtnode = {
      id,
      type: "processnode",
      data: { label:"Not Needed" , processtype: modal, content: processdata, type ,remove: remove, edit: edit},
      position: { x: 0, y: prevplus.height+150 },
    };
    setEdge((eds) => eds.filter((edge) => edge.id !== prevplus.edgeid));
    setNode((prev) => [...prev, newtnode]);
    setNode((prev)=>prev.map((item)=>{if(item.id === "1000"){return {...item, position:{x:75,y:prevplus.height+300}}}else{return item}}))
    setEdge((ed) => [...ed, {id:`e${prevplus.source}-e${id}`, source: `${prevplus.source}` , target:`${id}`}, {id:`e${id}-e1000`, source: `${id}` , target:"1000"}])
    setPrevplus({edgeid:`e${id}-e1000`, source: `${id}` , target:"1000" ,height:prevplus.height+150})
  }
  async function sendtoback (){
    setSavestatus(null)
    const form = new FormData()
    const formdata = {
      data: cart }
    form.append("data",nodes)
    const response = await fetch("https://react-flow-project-zeta.vercel.app/api/createschedule" , {
      method : "POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formdata)
    })
    const json = await response.json();
    if(json.success){
      setSavestatus("Saved and Scheduled Successfully")
    }

  }

  return (
    <div className="">
  
      <div className="flex space-x-2 items-center justify-start p-2 ">
      <button className="p-2 border rounded-md hover:bg-green-500 hover:text-white " onClick={()=>{if(cart.process && cart.process.length>0 && cart.process[0].type !== "follow up"){sendtoback()}else{setSavestatus("Something wrong, not making a chain or , or some wrong entry on first node")}}}>Save and Schedule</button>
      {savestatus && <span className="text-green-500 font-bold">{savestatus}</span>}
      </div>
      {listmodal && <Listmodal closelist={closelist} changelist={changelist} />}
      {procmodal && <Processmodal closepros={closepros} cart={cart} tempdone={tempdone} />}
      {editrigger && <EditListModal listnames={cart.listnames} changelist={changelist} closelist={()=>{setEditrigger(false)}} />}
      {editmodal && <EditModal  nodedata={nodes.filter((item)=>item.id === editmodal)} update={update} cart={cart} closeedit={closeedit} type="ding ding"/>}
      <div
        className="md:h-[45rem]    h-full w-screen m-auto"
        ref={reactflowbox}
      >
        
        <ReactFlow
          style={{ backgroundColor: "#F7F7F7", border: "  " }}
          edges={edges}
          nodes={nodes}
          onConnect={onConnect}
        
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}

      
          fitView
          nodeTypes={newnode}
          onInit={setReactflowinstance}
          defaultNodes={initialnode}
          defaultEdges={initialEdges}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}

        >

         
         
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
