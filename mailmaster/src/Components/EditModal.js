import React, { useEffect, useState } from 'react'
import { CgCloseR } from 'react-icons/cg'
import { CiCircleRemove } from 'react-icons/ci';
import { MdAdd } from 'react-icons/md';

const EditModal = ({type, closeedit,nodedata, cart, update }) => {
const [modaltype, setModaltype] = useState("");
const [lasttype, setLasttype] = useState(null);
const waitlist = ["Days", "Weeks", "Month","seconds"];
const [wait, setWait] = useState(null);
const [waittype, setWaittype] = useState("Days");
const [template, setTemplate] = useState([]);
const [modal, setModal] = useState(null);
const [Tempname, setTempname] = useState("");
const [tempselected, setTempSelected] = useState(false);

const [addmodal, setAddmodal] = useState(null);
const [newTemp, setNewTemp] = useState("");
const [temptext, setTemptext] = useState("")
  const [mailstatus, setMailstatus] = useState("new email");
  useEffect(() => {
    if (cart.process.length > 0) {
      setLasttype(cart.process.at(-1).processtype);
      if (cart.process.at(-1).processtype === "email") {
        setMailstatus(cart.process.at(-1).type);
      }
    } else {
      setMailstatus("new email");
    }
  }, [cart]);
useEffect(() => {
  console.log(type,nodedata)
  setModaltype(nodedata[0].data.processtype)
}, [type])
async function fetchtemp (){
    try {
        const response = await fetch("https://react-flow-project-zeta.vercel.app/api/fetchtemplate",{
            method: "GET"
        })
        const json = await response.json()
        setTemplate(json)
        
       } catch (error) {
        console.log(error.message)
       }
}
  useEffect(() => {
  
    fetchtemp()
   
  }, [])
const savetemp = async ()=>{
    const data = {
      name: newTemp,
      text: temptext
    }
    try {
      const response = await fetch("https://react-flow-project-zeta.vercel.app/api/savetemplate",{
        method : "POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const json = await response.json();
      if(json.status){
        fetchtemp()
        setAddmodal(false)
        setNewTemp("")
        setTemptext("")
      }
    } catch (error) {
      console.log(error.message)
    }

  }

  return (
    <div>
        <div className="bg-opacity-30 font-sans text-gray-700 h-screen w-screen  md:px-7 lg:px-28 xl:px-96 py-28 fixed z-[1000] flex items-center justify-center bg-black">
      <div className="p-4 bg-gray-50 w-full h-full rounded-md">
        <div onClick={()=>{closeedit()}} className="border-b  text-blue-700 w-full flex justify-end my-2 underline-offset-2 cursor-pointer ">
          <CgCloseR size={32} />
        </div>
        {modaltype === "wait" && (
              <div>
                <h1 className="font-bold">Update Wait </h1>
                <p>Add a delay between blocks.</p>
                <div className="   my-2   ">
                  <h2 className="my-2 font-sans  ">Wait for</h2>
                  <div className="p-2 border rounded-md bg-white">
                    <input
                      type="number"
                      onChange={(e) => {
                        setWait(e.target.value);
                      }}
                      placeholder=""
                      className="border-none w-full border  outline-none "
                    />
                  </div>
                  <h2 className="my-2 font-sans py-2">Wait type</h2>
                  <select
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => {
                      setWaittype(e.target.value);
                    }}
                    value={waittype}
                  >
                    {waitlist.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {wait && (
                    <div className="flex justify-end items-center w-full ">
                      <button
                        onClick={() => {
                         update(nodedata[0].id,wait, modal, waittype);
                          closeedit();
                        }}
                        className=" bg-blue-500 hover:bg-blue-600 text-white p-1 px-2 rounded-md my-2"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {modaltype === "email" && (
              <div>
                <h1 className="font-bold">Update Cold Email </h1>
                <p>Send an email to a lead</p>
                <div className=" flex justify-between ">
                  <h1 className="font-bold mt-4 py-2">Email template</h1>
                  <button onClick={()=>{setAddmodal((prev)=>!prev)}} className="flex justify-between items-center space-x-2 text-blue-500 border-2 p-1 rounded-md border-blue-500 ">
                    <span>New Template</span> <MdAdd />
                  </button>
                </div>
                {addmodal && (
              <div className="w-full  border rounded-md p-2 bg-white">
                <label id="Teamname" className="font-semibold ">
                  Template Name
                </label>
                <div>
                  <input
                    type="text"
                    onChange={(e) => {
                      setNewTemp(e.target.value);
                    }}
                    placeholder="Type Template Name"
                    className="bordernone p-2  w-full border  outline-none "
                  />
                </div>
                {newTemp.length > 0 && (
                  <div className="my-2">
                    <h2 className="font-semibold">Text</h2>
                    <div>
                      <input
                        type="text"
                        onChange={(e) => {
                          setTemptext(e.target.value);
                        }}
                        placeholder="Type Text for template"
                        className="bordernone p-2  w-full border  outline-none "
                      />
                    </div>
                  {temptext.length>0 && <div className=" w-full flex justify-end   "><button onClick={()=>{

                    savetemp() 
                  }} className="p-2 font-semibold my-2  text-white rounded-md bg-blue-400 hover:bg-blue-500">Create Template</button></div>}
                  </div>
                )}
              </div>
            )}
                <div className="relative w-full">
                  <div className="flex justify-center border p-2 my-2 bg-gray-100  items-center">
                    <input
                      type="text"
                      value={Tempname}
                      disabled={tempselected}
                      onChange={(e) => {
                        setTempname(e.target.value);
                      }}
                      placeholder="Type template name"
                      className="border-none w-full border bg-gray-100  outline-none "
                    />
                    {tempselected && (
                      <div
                        onClick={() => {
                          setTempname("");
                          setTempSelected(false);
                        }}
                        className="flex justify-center bg-gray-100  h-full items-center"
                      >
                        <CiCircleRemove size={23} />
                      </div>
                    )}
                  </div>
                  <div className="bg-white absolute right-0 left-0  overflow-y-scroll  overflow-hidden">
                    {Tempname.length > 0 &&
                      !tempselected && template.length>0 &&
                      template
                        .filter((item) => {
                          const itemsearch = item.name.toUpperCase();
                          const searchterm = Tempname.toUpperCase();
                          if (searchterm.length > 0) {
                            return itemsearch.includes(searchterm);
                          }
                        })
                        .map((item, index) => (
                          <span
                            onClick={() => {
                              setTempname(item.name);
                              setTempSelected(true);
                            }}
                            className="w-full p-2  block cursor-pointer my-2  hover:bg-gray-100"
                            key={index}
                          >
                            {item.name}
                          </span>
                        ))}
                  </div>
                  {cart.process[0].id !== nodedata[0].id && 
                    <div className="w-full">
                    <h1 className="font-bold mt-4 py-2">Email </h1>
                  <select
                      onChange={(e) => {
                        setMailstatus(e.target.value);
                      }}
                      className="w-full p-2 border"
                    >
                      <option value={"new email"}>New Mail</option>
                      <option value={"follow up"}>RE: Follow Up</option>
                    </select></div>
                  }
                  {tempselected && (
                    <div className="flex justify-end items-center w-full ">
                      <button
                        onClick={() => {
                         update(nodedata[0].id,Tempname, modal, mailstatus);
                          closeedit();
                        }}
                        className=" bg-blue-500 hover:bg-blue-600 text-white p-1 px-2 rounded-md my-2"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
        </div>
    </div>
  )
}

export default EditModal