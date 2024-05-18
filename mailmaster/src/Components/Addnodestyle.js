import React, { useCallback, useEffect } from 'react'
import { Background, Handle, Position, useOnSelectionChange } from 'reactflow'
import { RiAddBoxLine } from "react-icons/ri";
import { MdAdd } from 'react-icons/md';


const Plusnode = ({data, id, selected}) => {
 
 
  
  return (
    <>
    <div onClick={()=>{data.openproc()}} className='border bg-white p-1 rounded text-blue-500 border-blue-500'><Handle type="target"  id="c1" position={Position.Top} className='w-0 h-0 p-0 rounded-t-full  contain-none border-none  bg-gray-400'  style={{ margin: 0, padding: 0 }}/>
        <MdAdd/></div></>

  )
}

export default Plusnode