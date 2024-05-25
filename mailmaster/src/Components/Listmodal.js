import React, { useEffect, useState } from "react";
import { CgCloseR } from "react-icons/cg";
import { GoPersonAdd } from "react-icons/go";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
const Listmodal = ({ type, length, closelist,changelist }) => {
  const [modal, setModal] = useState(null);
  const [searchitem, setSearchitem] = useState("");
  const [selecteditem, setSelecteditem] = useState([]);
  const [newmodal, setNewmomdal] = useState(false);
  const [Teamname, setTeamname] = useState("");
  const [Receipentslist, setReceipentslist] = useState("");
  const [listitem , setListitems]=  useState([]);
  async function fetchtlist (){
    try {
  
        const responselist = await fetch("https://react-flow-project-zeta.vercel.app/api/fetchlist",{
            method: "GET"
        })
        const jsonlist = await responselist.json()
        setListitems(jsonlist)
        
       } catch (error) {
        console.log(error.message)
       }
}
  useEffect(() => {
  
    fetchtlist()
   
  }, [])
  const savelist = async ()=>{
    const data = {
      name: Teamname,
      emails: Receipentslist
    }
    try {
      const response = await fetch("https://react-flow-project-zeta.vercel.app/api/savelist",{
        method : "POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const json = await response.json();
      if(json.status){
        fetchtlist()
        setNewmomdal(false)
        setTeamname("")
        setReceipentslist("")
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="bg-opacity-30 font-sans text-gray-700 h-screen w-screen  md:px-7 lg:px-28 xl:px-96 py-28 fixed z-[1000] flex items-center justify-center bg-black">
      <div className="p-4 bg-gray-50 w-full h-full rounded-md">
        <div onClick={()=>{closelist()}} className="border-b  text-blue-700 w-full flex justify-end my-2 underline-offset-2 cursor-pointer ">
          <CgCloseR size={32} />
        </div>
        {!modal ? (
          <>
            <h1 className="font-bold">Add a Source Block </h1>
            <p>
              Pick a Block & configure, any new leads that match rules wilcd l be
              added to sequence atumatically{" "}
            </p>
            <h1 className="font-bold mt-4 py-2">Add a Source Block </h1>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setModal("list");
                }}
                className="grid grid-cols-5 gap-2 p-4 border cursor-pointer hover:bg-gray-100 bg-white rounded "
              >
                <div className="flex justify-center py-2 text-red-500 border-red-500 rounded-md bg-red-100  items-center border">
                  <GoPersonAdd size={42} />
                </div>
                <div className="col-span-4 ">
                  <h2 className="font-semibold">Leads from List(s)</h2>
                  <span>Connect multiple list as source for this sequence</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 p-4 border cursor-pointer hover:bg-gray-100 bg-white rounded ">
                <div className="flex justify-center py-2 text-red-500 border-red-500 rounded-md bg-red-100  items-center border">
                  <GoPersonAdd size={42} />
                </div>
                <div className="col-span-4 ">
                  <h2 className="font-semibold">Leads from List(s)</h2>
                  <span>Connect multiple list as source for this sequence</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 p-4 border cursor-pointer hover:bg-gray-100 bg-white rounded ">
                <div className="flex justify-center py-2 text-red-500 border-red-500 rounded-md bg-red-100  items-center border">
                  <GoPersonAdd size={42} />
                </div>
                <div className="col-span-4 ">
                  <h2 className="font-semibold">Leads from List(s)</h2>
                  <span>Connect multiple list as source for this sequence</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 p-4 border cursor-pointer hover:bg-gray-100 bg-white rounded ">
                <div className="flex justify-center py-2 text-red-500 border-red-500 rounded-md bg-red-100  items-center border">
                  <GoPersonAdd size={42} />
                </div>
                <div className="col-span-4 ">
                  <h2 className="font-semibold">Leads from List(s)</h2>
                  <span>Connect multiple list as source for this sequence</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className=" bottom-3 top-3 ">
            <h1 className="font-bold">Leads from List(s)</h1>
            <p>Connect multiple lists as source fot this sequence</p>
            <div className="flex my-2 justify-between items-center">
              <span className="font-semibold">Select your List(s)</span>
              <div
                onClick={() => {
                  setNewmomdal((prev)=>!prev);
                }}
                className="p-2 flex justify-between items-center space-x-2 border-2 font-semibold hover:text-blue-700 cursor-pointer text-blue-600 rounded border-blue-600"
              >
                <span>New list</span>
                <IoMdAddCircleOutline size={24} />
              </div>
            </div>
            {newmodal && (
              <div className="w-full  border rounded-md p-2 bg-white">
                <label id="Teamname" className="font-semibold ">
                  Team Name
                </label>
                <div>
                  <input
                    type="text"
                    onChange={(e) => {
                      setTeamname(e.target.value);
                    }}
                    placeholder="Type Team Name"
                    className="bordernone p-2  w-full border  outline-none "
                  />
                </div>
                {Teamname.length > 0 && (
                  <div className="my-2">
                    <h2 className="font-semibold">Reciepents</h2>
                    <div>
                      <input
                        type="text"
                        onChange={(e) => {
                          setReceipentslist(e.target.value);
                        }}
                        placeholder="Receipents Comma(,) Separated for multiple"
                        className="bordernone p-2  w-full border *:p-2 outline-none "
                      />
                    </div>
                  {Receipentslist.length>0 && <div className=" w-full flex justify-end   "><button onClick={()=>{

                    savelist() 
                  }} className="p-2 font-semibold my-2  text-white rounded-md bg-blue-400 hover:bg-blue-500">Create List</button></div>}
                  </div>
                )}
              </div>
            )}
            <div className=" my-2  relative  rounded-sm">
              <div className="border flex items-center bg-white p-2 my-2">
                <div className="flex space-x-2">
                  {selecteditem.map((item, index) => (
                    <span
                      key={index}
                      onClick={() => {
                        setSelecteditem((prev) => {
                          return prev.filter((itemlist) => itemlist !== item);
                        });
                      }}
                      className=" border flex rounded-md hover:bg-slate-200 cursor-pointer  justify-center items-center p-1 text-sm flex-nowrap space-x-2  bg-slate-100"
                    >
                      <span className="text-nowrap">{item} </span>
                      <CiCircleRemove />
                    </span>
                  ))}
                </div>{" "}
                <input
                  onChange={(e) => {
                    setSearchitem(e.target.value);
                  }}
                  className="w-full px-2 py-2   outline-none border-none "
                  placeholder="Search for list"
                />
              </div>
              {selecteditem.length > 0 && (
                <div className="w-full bg-gray-50 my-2 flex justify-end ">
                  <button onClick={()=>{changelist("1",selecteditem,false ) ; closelist()}} className=" p-2 border bg-blue-500 text-white rounded-lg font-semibold px-4">
                    
                    Insert
                  </button>
                </div>
              )}
              <div className=" bg-white absolute right-0 left-0  overflow-y-scroll  overflow-hidden  max-h-40 ">
                { searchitem.length>0 && listitem.length>0 && listitem
                  .filter((item) => {
                    const itemsearch = item.name.toUpperCase();
                    const searchterm = searchitem.toUpperCase();
                    if (searchitem.length > 0) {
                      return (
                        itemsearch.includes(searchterm) &&
                        !selecteditem.includes(item.name)
                      );
                    }
                  })
                  .map((item, index) => (
                    <span
                      onClick={() => {
                        setSelecteditem((prev) => [...prev, item.name]);
                      }}
                      className="w-full p-2  block cursor-pointer my-2  hover:bg-gray-100"
                      key={index}
                    >
                      {item.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Listmodal;
