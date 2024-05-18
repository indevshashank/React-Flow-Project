import React, { useCallback, useEffect } from 'react'
import { Background, Handle, Position, useOnSelectionChange } from 'reactflow'

import { MdAdd } from "react-icons/md";
import { GoPersonAdd } from 'react-icons/go';

const Newnode = ({data, id, selected}) => {
 

  
  return (
    <>
    <div className='text-[10px] w-44 border '>
 
       {!data.listnames.length>0 ? <div  onClick={()=>{data.openlistmodal()}} className={` p-2  bg-white font-sans text-gray-700 items-center flex flex-col `}  >
          <MdAdd/>
          <p>Add Lead Source</p>
          <p >Click to add list from List or CRM</p>
          </div>:
        <div className=''>
          <div className="grid grid-cols-5 gap-2 p-4 border cursor-pointer hover:bg-gray-100 bg-white rounded ">
                <div className="flex col-span-2 justify-center py-2 text-red-500 rounded-md bg-red-100  items-center ">
                  <GoPersonAdd size={28} />
                </div>
                <div className="col-span-3 ">
                  <h2 className="font-semibold">Leads from List(s)</h2>
                  {data.listnames.map((item, index)=><p className='block' key={index}>{item}</p>)}
                </div>
              </div>
        <Handle type="source"  id="c1" position={Position.Bottom} className='w-0 h-0 p-0 rounded-b-full contain-none border-none ro bg-gray-400'  style={{ margin: 0, padding: 0 }}/>    
        </div>}
        </div>  
    </>
  )
}

export default Newnode