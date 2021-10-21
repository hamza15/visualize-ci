import React from 'react';

const Sidebar = (props) => {

    const onDragStart = (event, nodeType) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    };

    const onSubmit = (e) => {
      e.preventDefault();
      props.updateNode(e)
      e.target.reset();
    }

    const setWorkflowName = (e) => {
      e.preventDefault();
      props.setWorkflow(e)
      e.target.reset();
    }

    const onClick = () => {
      props.generateConfig()
    }

    const handleOrbs = (orb) => {
      props.updateOrb(orb);
      console.log(orb);
  }

    return (
// Node Types
      <aside>
        <div className="description">You can drag these nodes to the pane on the right.</div>
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
          Input Node
        </div>
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
          Default Node
        </div>
        <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
          Output Node
        </div>

{/*Node Label*/}
        {props.jobInfo && (<div className="mt-12 description">
        <div className="mt-12 description"></div>
          <form onSubmit={onSubmit}>
            <label className="font-bold">
              Update Node Label:
              <input pattern="^\S+$" className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" />
            </label>
            <div className="mt-4">
            <label className="font-bold">Executor: </label>
            <select name="Executor" className="bg-black shadow text-white ml-4 font-bold py-1 px-1 rounded" onChange={event => handleOrbs(event.target.value)}>
              <option value="" className="">- select</option>
              <option value="docker" className="">docker</option>
              <option value="machine" className="">machine</option>
              <option value="macos" className="">macos</option>
              <option value="windows" className="">windows</option>
            </select>
            </div>
            <div className="mt-4">
            <label className="font-bold">Resource Class: </label>
            <select name="resource_class" className="bg-black shadow text-white ml-4 font-bold py-1 px-1 rounded" onChange={event => handleOrbs(event.target.value)}>
              <option value="" className="">- select</option>
              <option value="default" className="">default</option>
              <option value="large" className="">large</option>
              <option value="xlarge" className="">xlarge</option>
            </select>
            </div>
            <input type="submit" value="Submit" className="mt-8 shadow bg-black hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"/>
          </form>
        </div>
        )}

{/* Workflow Label */}
      {/* {!props.workflowSubmission && (<div className="mt-12 description">
          <form onSubmit={setWorkflowName}>
            <label className="font-bold">
              Workflow Label:
              <input pattern="^\S+$" required className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" />
            </label>
            <input type="submit" value="Submit" className="mt-4 shadow bg-black hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"/>
          </form>
        </div>)}

        {props.workflowSubmission&& (<table className="mt-14 table-fixed">
          <thead>
            <tr>
              <th className="font-bold">Workflow Label</th>
            </tr>
          </thead>
            <tbody>
              <tr>
                <td>{props.workflowName}</td>
              </tr>
            </tbody>
          </table>)} */}
          
{/*Orbs*/}
          {/* <div className="mt-16 description">
            <label className="font-bold ">Orbs</label>
            <select name="Orbs" className="bg-black shadow text-white ml-4 font-bold py-1 px-1 rounded" onChange={event => handleOrbs(event.target.value)}>
              <option value="" className="">- select</option>
              <option value="Slack" className="">Slack</option>
            </select>
          </div> */}

{/*Generate Config */}
        <div className="fixed bottom-2 ">
          <button onClick={onClick} className="shadow bg-red-500 hover:bg-black w-full focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">Generate Config</button>
        </div>

        
      </aside>
    );
};

export default Sidebar;