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
  const [cart, setCart] = useState({})
  const [listmodal, setListmodal]= useState(false)
  const [selectedEdges, setSelectedEdges] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState(null);
  const [edges, setEdge, onEdgesChange] = useEdgesState(initialEdges);
  const [procmodal, setProcmodal] = useState(false)
  const reactflowbox = useRef();
  const [savestatus, setSavestatus] = useState(false)
  const [reactflowinstance, setReactflowinstance] = useState(null);
  const [doc, setDoc] = useState(null);
  const [mtrigger, setMtrigger]= useState(false)
  const openlistmodal = ()=>{
    setListmodal(true)
  }
 useEffect(() => {
  if(cart.listnames && mtrigger){
    setProcmodal(true)
    setMtrigger(false)
  }
 }, [cart,mtrigger])
 
  const openproc = ()=>{
    setMtrigger(true)
  }
  const initialnode = [
    {
      id: "1",
      type: "Newnode",
      position: {x:0, y :0},
      data: { label: "Color Node", color: "#5c3838",
      openlistmodal : openlistmodal , listnames: []},
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

const closelist = ()=>{setListmodal(false)} 
const changelist = (id, newLabel) => {
  const newcart  = {listnames: newLabel, process: []}  
  setCart(newcart)

  setNode((nds) =>
    nds.map((node) => {

      if (node.id === id) {
 
        return {
          ...node,
          data: {
            ...node.data,
            listnames: [...node.data.listnames,...newLabel],
          },
        };
      }
      return node;
    })
  );
  setEdge((ed) => [...ed, {id:"edgemain", source: "1", target:"2"}])
};
function remove (id){
  console.log(id,nodes,edges)
  // setNode((nds)=>nds.filter((item)=>item.id !== id))
}

//NOTE return
  const tempdone = (processdata, modal, type)=>{
    if (modal=== "email"){
        let newcart = {...cart,process: [...cart.process, {processtype : modal, data: processdata, type}] }
        setCart(newcart)
    }else if (modal === "wait"){
        let newcart = {...cart,process: [...cart.process, {processtype : modal, data: processdata, type}] }
        setCart(newcart)
    }
    const prevsource = prevplus.source
    const id = `${Number(prevsource)+1}`
    const newtnode = {
      id,
      type: "processnode",
      data: { label:"Not Needed" , processtype: modal, content: processdata, type ,remove: remove},
      position: { x: 0, y: prevplus.height+150 },
    };
    setEdge((eds) => eds.filter((edge) => edge.id !== prevplus.edgeid));
    setNode((prev)=>prev.map((item)=>{if(item.id === "1000"){return {...item, position:{x:75,y:prevplus.height+300}}}else{return item}}))
    setNode((prev) => [...prev, newtnode]);
    setEdge((ed) => [...ed, {id:`e${prevplus.source}-e${id}`, source: `${prevplus.source}` , target:`${id}`}, {id:`e${prevplus.id}-e1000`, source: `${id}` , target:"1000"}])
    setPrevplus({edgeid:`e${prevplus.id}-e1000`, source: `${id}` , target:"1000" ,height:prevplus.height+150})
    
  }
  async function sendtoback (){
    setSavestatus(false)
    const form = new FormData()
    const formdata = {
      data: cart
      
    }
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
      setSavestatus(true)
    }

  }
  return (
    <div className="">
      <div className="ml-4">
        <h1 className="font-semibold text-xl text-fuchsia-600 drop-shadow-md">React MERN Task</h1>
        <h2>Mailmaster</h2>
      </div>
      <div className="flex space-x-2 items-center justify-start p-2 ">
      <button className="p-2 border rounded-md hover:bg-green-500 hover:text-white " onClick={()=>{if(cart.process && cart.process.length>0){sendtoback()}}}>Save and Schedule</button>
      {savestatus && <span className="text-green-500 font-bold">Saved and Scheduled Successfully</span>}
      </div>
      {listmodal && <Listmodal closelist={closelist} changelist={changelist} />}
      {procmodal && <Processmodal closepros={closepros} cart={cart} tempdone={tempdone} />}
      <div
        className=" w-screen m-auto"
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
