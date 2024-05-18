import React, { useCallback, useEffect } from "react";
import { Background, Handle, Position, useOnSelectionChange } from "reactflow";

import { MdAdd } from "react-icons/md";
import { GoPersonAdd } from "react-icons/go";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";
import { CgCloseR } from "react-icons/cg";
import { FiEdit } from "react-icons/fi";
const ProcessNode = ({ data, id, selected }) => {
  return (
    <>
      <div className="text-[10px] w-44 border relative ">
        {/* <div className="absolute -top-2 right-0 flex space-x-1">
          <div className="bg-orange-300 text-orange-500 rounded-sm cursor-pointer">
            <FiEdit size={15} />
          </div>
          <div
            onClick={() => {
              data.remove(id);
            }}
            className="bg-fuchsia-300 rounded-sm text-fuchsia-500 cursor-pointer"
          >
            <CgCloseR size={15} />
          </div>
        </div> */}
        {!data.content.length > 0 ? (
          <div
            onClick={() => {
              data.openlistmodal();
            }}
            className={` p-2  bg-white font-sans text-gray-700 items-center flex flex-col `}
          >
            <MdAdd />
            <p>Add Lead Source</p>
            <p>Click to add list from List or CRM</p>
          </div>
        ) : (
          <div className="">
            <div className="grid grid-cols-5 gap-2 p-4 border cursor-pointer hover:bg-gray-100 bg-white rounded ">
              {data.processtype === "email" && (
                <>
                  <div className="flex col-span-2 justify-center py-2 text-red-500 rounded-md bg-red-100  items-center ">
                    <MdOutlineEmail size={28} />
                  </div>
                  <div className="col-span-3 ">
                    <h2 className="font-semibold">Send Email</h2>
                    <p className="block text-red-500">
                      <span className="font-semibold text-gray-900 ">
                        Template :
                      </span>{" "}
                      {data.content}
                    </p>
                    <p className="block text-red-500">
                      <span className="font-semibold text-gray-900">
                        Type :
                      </span>{" "}
                      {data.type}{" "}
                    </p>
                  </div>
                </>
              )}
              {data.processtype === "wait" && (
                <>
                  <div className="flex col-span-2 justify-center py-2 text-sky-500 rounded-md bg-sky-100  items-center ">
                    <MdOutlineAccessTime size={28} />
                  </div>
                  <div className="col-span-3 ">
                    <h2 className="font-semibold">Wait/Delay</h2>
                    <p className="block text-blue-500">
                      <span className="font-semibold text-gray-900">
                        Time :
                      </span>{" "}
                      {data.content}{" "}
                    </p>
                    <p className="block text-blue-500">
                      <span className="font-semibold text-gray-900">
                        Type :
                      </span>{" "}
                      {data.type}{" "}
                    </p>
                  </div>
                </>
              )}
            </div>
            <Handle
              type="target"
              id="c1"
              position={Position.Top}
              className="w-0 h-0 p-0 rounded-t-full contain-none border-none ro bg-gray-400"
              style={{ margin: 0, padding: 0 }}
            />
            <Handle
              type="source"
              id="c1"
              position={Position.Bottom}
              className="w-0 h-0 p-0 rounded-b-full contain-none border-none ro bg-gray-400"
              style={{ margin: 0, padding: 0 }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProcessNode;
