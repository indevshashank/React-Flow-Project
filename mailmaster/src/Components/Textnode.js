import React, { useCallback, useEffect } from 'react'
import { Background, Handle, Position, useOnSelectionChange } from 'reactflow'

import { MdAdd } from "react-icons/md";

const TextNode = ({data, id, selected}) => {
 

  
  return (
    <>
    <div className='text-[10px] w-44 border '>
 
        <div className={` p-2  bg-white text-gray-700 items-center flex flex-col `}  >
  
          <p className='font-sans'>Sequence Start Point</p>
          </div>
   
        <Handle type="target"  id="c1" position={Position.Top} className='w-0 h-0 p-0 rounded-t-full contain-none border-none ro bg-gray-400'  style={{ margin: 0, padding: 0 }}/>   
        <Handle type="source"  id="c1" position={Position.Bottom} className='w-0 h-0 p-0 rounded-b-full contain-none border-none ro bg-gray-400'  style={{ margin: 0, padding: 0 }}/>   

        </div>  
    </>
  )
}

export default TextNode