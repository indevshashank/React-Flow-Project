import React, { useEffect, useState } from "react";
import { CgCloseR } from "react-icons/cg";
import { GoPersonAdd } from "react-icons/go";

import { MdAdd } from "react-icons/md";
import { CiCircleRemove } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";
import { FiFilter } from "react-icons/fi";
const Processmodal = ({ type, length, closepros, tempdone, cart }) => {


  const [lasttype, setLasttype] = useState(null);
  const waitlist = ["Days", "Weeks", "Month","seconds"];
  const [template, setTemplate] = useState([]);
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
    fetchtemp()
   
  }, [])
  

  const [mailtype, setMailtype] = useState("");
  const [modal, setModal] = useState(null);
  const [searchitem, setSearchitem] = useState(" ");
  const [selectedtemp, setSelectedtemp] = useState("");
  const [newmodal, setNewmomdal] = useState(false);
  const [Tempname, setTempname] = useState("");
  const [tempselected, setTempSelected] = useState(false);
  const [Receipentslist, setReceipentslist] = useState("");
  const [wait, setWait] = useState(null);
  const [waittype, setWaittype] = useState("Days");
 


 
  return (
    <div className="bg-opacity-30 font-sans text-gray-700 h-screen w-screen md:px-7 lg:px-28 xl:px-96 py-28  fixed z-[1000] flex items-center justify-center bg-black">
      <div className="p-4 bg-gray-50 h-full w-full rounded-md">
        <div
          onClick={() => {
            closepros();
          }}
          className="border-b  text-blue-700 w-full flex justify-end my-2 underline-offset-2 cursor-pointer "
        >
          <CgCloseR size={32} />
        </div>
        {!modal ? (
          <>
            <h1 className="font-bold">Add Block </h1>
            <p>Click on Block to configure and add it in sequence</p>
            <h1 className="font-bold mt-4 py-2">Outreach </h1>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setModal("email");
                }}
                className="grid grid-cols-5 gap-2 p-4 border cursor-pointer hover:bg-gray-100 bg-white rounded "
              >
                <div className="flex justify-center p-2 text-red-500 border-red-500 rounded-md bg-red-100  items-center border">
                  <MdOutlineEmail size={42} />
                </div>
                <div className="col-span-4 ">
                  <h2 className="font-semibold">Cold Email</h2>
                  <span>Send an Email to a Lead</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 p-4 border cursor-pointer hover:bg-gray-100 bg-white rounded ">
                <div className="flex justify-center p-2 text-red-500 border-red-500 rounded-md bg-red-100  items-center border">
                  <GoPersonAdd size={42} />
                </div>
                <div className="col-span-4 ">
                  <h2 className="font-semibold">Task</h2>
                  <span>Schedule a manual Task</span>
                </div>
              </div>
            </div>
            {lasttype && (
              <>
                <h1 className="font-bold mt-4 py-2">Conditions</h1>
                <div className="grid grid-cols-2 gap-4">
                  {lasttype === "email" && (
                    <div
                      onClick={() => {
                        setModal("wait");
                      }}
                      className="grid grid-cols-5 gap-2 p-4 border cursor-pointer hover:bg-gray-100 bg-white rounded "
                    >
                      <div className="flex justify-center p-2 bg-sky-100 text-sky-500 border-sky-500 rounded-md   items-center border">
                        <MdOutlineAccessTime size={42} />
                      </div>
                      <div className="col-span-4 ">
                        <h2 className="font-semibold">Wait/Delay</h2>
                        <span>Add a delay between blocks.</span>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-5 gap-2 p-4 border cursor-pointer hover:bg-gray-100 bg-white rounded ">
                    <div className="flex justify-center p-2 text-sky-500 border-sky-500 rounded-md bg-sky-100  items-center border">
                      <FiFilter size={42} />
                    </div>
                    <div className="col-span-4 ">
                      <h2 className="font-semibold">If/Else (Rules)</h2>
                      <span>Routes Leads to sequence based on events.</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full">
            {modal === "email" && (
              <div>
                <h1 className="font-bold">Cold Email </h1>
                <p>Send an email to a lead</p>
                <div className=" flex justify-between ">
                  <h1 className="font-bold mt-4 py-2">Email template</h1>
                  <button className="flex justify-between items-center space-x-2 text-blue-500 border-2 p-1 rounded-md border-blue-500 ">
                    <span>New Template</span> <MdAdd />{" "}
                  </button>
                </div>
                <div className="relative w-full">
                  {" "}
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
                  <div className="bg-white absolute right-0 left-0">
                    {Tempname.length > 0 &&
                      !tempselected && template.length>0 &&
                      template
                        .filter((item) => {
                          const itemsearch = item.name.toUpperCase();
                          const searchterm = Tempname.toUpperCase();
                          if (searchitem.length > 0) {
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
                  {lasttype && (
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
                  )}
                  {tempselected && (
                    <div className="flex justify-end items-center w-full ">
                      <button
                        onClick={() => {
                          tempdone(Tempname, modal, mailstatus);
                          closepros();
                        }}
                        className=" bg-blue-500 hover:bg-blue-600 text-white p-1 px-2 rounded-md my-2"
                      >
                        Insert
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {modal === "wait" && (
              <div>
                <h1 className="font-bold">Wait </h1>
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
                          tempdone(wait, modal, waittype);
                          closepros();
                        }}
                        className=" bg-blue-500 hover:bg-blue-600 text-white p-1 px-2 rounded-md my-2"
                      >
                        Insert
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Processmodal;
