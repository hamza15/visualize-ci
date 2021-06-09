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

    return (
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

        <div>
        <div className="mt-12 description">Select the node you would like to update.</div>
          <form onSubmit={onSubmit}>
            <label>
              Update Node Label:
              <input pattern="^\S+$" className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" />
            </label>
            <input type="submit" value="Submit" className="mt-4 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"/>
          </form>
        </div>

        <div className="mt-12 description">Set the workflow title.</div>
          <form onSubmit={setWorkflowName}>
            <label>
              Workflow Label:
              <input pattern="^\S+$" required className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" />
            </label>
            <input type="submit" value="Submit" className="mt-4 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"/>
          </form>

          <table className="mt-14 table-fixed">
          <thead>
            <tr>
              <th>Workflow Label</th>
            </tr>
          </thead>
            <tbody>
              <tr>
                <td>{props.workflowName}</td>
              </tr>
            </tbody>
          </table>

        <div className="static">
          <button onClick={onClick} className="mt-56 shadow bg-red-500 hover:bg-black w-full focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">Generate Config</button>
        </div>

        
      </aside>
    );
};

export default Sidebar;