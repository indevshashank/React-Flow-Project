import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  getConnectedEdges,
  Panel,
} from "reactflow";
import clipboard from "clipboard-copy";
import "reactflow/dist/style.css";
import Newtextnode from "./Newtextnode";
import customNode from "./customnode";

import "./btnstyle.css";

import "./styles.css";

import Dropper from "./Dropper";
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
  
  const reactflow = useReactFlow();
  // NOTE All States
  const [prevplus , setPrevplus] = useState({edgeid: "e2-e1000", source: "2", target: "1000" ,height: 220})
  const [cart, setCart] = useState({})
  const [listmodal, setListmodal]= useState(false)
  const [selectedEdges, setSelectedEdges] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState(null);
  const [edges, setEdge, onEdgesChange] = useEdgesState(initialEdges);
  const [procmodal, setProcmodal] = useState(false)
  const reactflowbox = useRef();
  const [reactflowinstance, setReactflowinstance] = useState(null);
  const [doc, setDoc] = useState(null);
  const [mtrigger, setMtrigger]= useState(false)
  const openlistmodal = ()=>{
    setListmodal(true)
  }
 useEffect(() => {
  if(cart.listnames && mtrigger){
    console.log("i am called")
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
  // drag function
  const dragoverstart = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  //Selecting function
  const selectionchange = useCallback((event) => {
    setSelectedNodes(event.nodes);
    setSelectedEdges(getConnectedEdges(event.nodes, reactflow.getEdges()));
  }, []);
  useEffect(() => {}, [selectedNodes,doc]);
  useEffect(() => {}, [selectedEdges]);

  //copying
  function copyItems(event) {
    const data = {
      nodes: selectedNodes,
      edges: selectedEdges,
    };
    const ob = JSON.stringify(data);
    clipboard(ob);
  }
  const pasteItems = async () => {
    const textFromClipboard = await navigator.clipboard.readText();
    const ob = JSON.parse(textFromClipboard);
    console.log(ob);
    const now = Date.now();
    if (ob.nodes && ob.nodes.length > 0) {
      ob.nodes.forEach((element) => {
        element.id = `${element.id}_${now}`;
      });
    }
    if (ob.edges && ob.edges.length > 0) {
      ob.edges.forEach((element) => {
        element.source = `${element.source}_${now}`;
        element.target = `${element.target}_${now}`;
        element.id = `${element.id}_${now}`;
      });
    }

    reactflow.addNodes(ob.nodes);
    nodes.forEach((element) => {
      element.selected = false;
    });
    setNode((prev) => nodes);
    setNode((prev) => [...prev, ...ob.nodes]);
    setEdge((prev) => [...prev, ...ob.edges]);
  };
  //NOTE cut function
  const cutItems = async () => {
    const data = {
      nodes: selectedNodes,
      edges: selectedEdges,
    };
    const ob = JSON.stringify(data);
    clipboard(ob);
    const newnodes = nodes.filter((item) => {
      return !selectedNodes.some((removeItem) => removeItem.id === item.id);
    });
    console.log(newnodes);
    setNode(newnodes);
  };
  const closepros=()=>{
    setProcmodal(false)
  }

  //NOTE drop function
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const boundingbox = reactflowbox.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const color = event.dataTransfer.getData("application/reactflowcolor");
      const label = event.dataTransfer.getData("application/reactflowlabel");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactflowinstance.project({
        x: event.clientX - boundingbox.left,
        y: event.clientY - boundingbox.top,
      });
      const nextnode = {
        id: getId(),
        type,
        position,
        data: { label: `${label}`, color: `${color}` },
      };
      setNode((prev) => prev.concat(nextnode));
    },
    [reactflowinstance]
  );

  // adding edge
  const addnode = useCallback(() => {
    const id = `${++nodeid}`;
    const newtnode = {
      id,

      data: { label: "New Lable" },
      position: { x: Math.random() * 200, y: Math.random() * 150 },
    };
    setNode((prev) => [...prev, newtnode]);;
  }, []);

  useEffect(() => {
    window.addEventListener("copy", copyItems);
    window.addEventListener("paste", pasteItems);
    window.addEventListener("cut", cutItems);

    return () => {
      window.removeEventListener("copy", copyItems);
      window.removeEventListener("paste", pasteItems);
      window.removeEventListener("cut", cutItems);
    };
  }, [selectedNodes, selectedEdges]);
  const onConnect = useCallback(
    (params) => {
      if (params.source !== params.target) {
        setEdge((eds) => addEdge(params, eds));
      }
    },
    []
  );


  //NOTE save function
  const saveFlow = useCallback(() => {
    if (reactflowinstance) {
      const flow = reactflowinstance.toObject();
      const string = JSON.stringify(flow);

      const element = document.createElement("a");
      const file = new Blob([string], {
        type: "text/plain;charset=utf-8",
      });
      element.href = URL.createObjectURL(file);
      element.download = "myFile.txt";
      document.body.appendChild(element);
      element.click();
    }
  }, [reactflowinstance]);

//NOTE handlefilesumbit
function handleFileChange(event) {
  const file = event.target.files[0];

  if (file) {
    // Read the contents of the selected file
    const reader = new FileReader();

    reader.onload = function (e) {
      // e.target.result contains the text content of the file
      const fileContent = e.target.result;

      // Now you can do something with the file content, like displaying it in the component's state or rendering it in your UI.
      setDoc((prev)=>fileContent)
    };

    // Read the file as text
    const text = reader.readAsText(file)
    console.log(text)    
  }
}
// NOTE  loading files  
  const loadfile = useCallback(() => {
     const flow = JSON.parse(doc);
    console.log(doc)
    if (flow) {
      
      setNode(flow.nodes || []);
      setEdge(flow.edges || []);
     
    }
    
  }, [doc]);


 // Event handler to prevent node movement on drag start
 const onNodeDragStart = (event, node) => {
  event.preventDefault();
};

useEffect(() => {
  console.log(cart);
}, [cart])

// Event handler to prevent node movement on drag stop
const onNodeDragStop = (event, node) => {
  event.preventDefault();
};

const closelist = ()=>{setListmodal(false)} 
const changelist = (id, newLabel) => {
  const newcart  = {listnames: newLabel, process: []}  
  setCart(newcart)
  console.log(id, newLabel)
  setNode((nds) =>
    nds.map((node) => {
      console.log(node)
      if (node.id === id) {
        console.log(node)
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
    const form = new FormData()
    const formdata = {
      data: cart
      
    }
    console.log(nodes)
    form.append("data",nodes)
    const response = await fetch("http://localhost:3001/api/createschedule" , {
      method : "POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formdata)
    })
    const json = await response.json();
    console.log(json)
  }
  return (
    <div className="">
      <button className="" onClick={()=>{sendtoback()}}>Save and Schedule</button>
      {listmodal && <Listmodal closelist={closelist} changelist={changelist} />}
      {procmodal && <Processmodal closepros={closepros} cart={cart} tempdone={tempdone} />}
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

          <Panel className="flex space-x-2" position="top-left">
            <button
              onClick={() => {
                saveFlow();
              }}
              className="bg-black px-4 py-2 text-white font-semibold hover:text-gray-200 rounded"
            >
              Save
            </button>
          
            <button
              onClick={() => {
                addnode()
              }}
              className="bg-black px-4 py-2 text-white font-semibold hover:text-gray-200 rounded"
            >
              Add Node
            </button>
          
          </Panel>
         
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
