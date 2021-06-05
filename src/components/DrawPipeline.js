import React, { useState, useRef } from 'react';
import ReactFlow, {addEdge, ReactFlowProvider, removeElements, Background, Controls} from 'react-flow-renderer';
import Sidebar from './Sidebar';
import './css/dnd.css';


const initialElements = [
    {
        id: '1',
        type: 'input',
        data: {
            label: 'Build'
        },
        position: {
            x:0,
            y:0
        }
    }
]


let id = 0;
const getId = () => `dndnode_${id++}`;


const DrawPipeline = () => {

    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

    const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: `${type} node` },
    };

    setElements((es) => es.concat(newNode));
  };

    const [elements, setElements] = useState(initialElements)

    // const [name, setName] = useState("")


    // const addNode = () => {
    //     setElements(e => e.concat({
    //         id: (e.length+1).toString(),
    //         data: {label: `${name}`},
    //         position: {x: 100, y: 45} 
    //     }))
    // }

    const onConnect = (params) => setElements(e => addEdge(params,e));

    //ADD CONDITION TO SHOW THIS PAGE OR Config.js component

    return(
        // <Fragment>
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        elements={elements}
                        onLoad={onLoad}
                        onConnect={onConnect}
                        connectionLineType= "bezier"
                        // snapToGrid= {true}
                        // snapGrid={[16,16]}
                        style={{width: '100%', height: '90vh'}}

                        onElementsRemove={onElementsRemove}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                    >
                        <Controls />
                        <Background 
                            color='#888'
                        />
                    </ReactFlow>
                    </div>
                <Sidebar />
                </ReactFlowProvider>
        </div>
            // </Fragment>
    )
}

export default DrawPipeline;