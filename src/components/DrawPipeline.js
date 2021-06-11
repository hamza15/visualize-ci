import React, { useEffect, useState, useRef } from 'react';
import ReactFlow, {addEdge, ReactFlowProvider, removeElements, Background, Controls} from 'react-flow-renderer';
import Sidebar from './Sidebar';
import Config from './Config'
import './css/dnd.css';


const initialElements = [
    {
        id: '1',
        type: 'input',
        data: {
            label: 'Build'
        },
        position: {
            x:750,
            y:300
        }
    }
]


let id = 2;
const getId = () => `${id++}`;


const DrawPipeline = () => {

    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements)
    const [nodeId, setNodeId] = useState("")
    const [nodeName, setNodeName] = useState("");
    const [workflowName, setWorkflowName] = useState("")
    const [config, setConfig] = useState(false)
    const [orb, setOrbName] = useState('');
    const [workflowSubmission, setWorkflowSubmission] = useState(false)

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
        data: { label: `${type}Node` },
        };

        setElements((es) => es.concat(newNode));
        console.log(elements)
    };

    const onConnect = (params) => setElements(e => addEdge(params,e));

    const updateNode = (e) => {
        e.preventDefault()
        setNodeName(e.target[0].value)
    }

    const updateOrb = (e) => {
        setOrbName(e)
    }

    const setWorkflow = (e) => {
        e.preventDefault()
        setWorkflowName(e.target[0].value)
        setWorkflowSubmission(true)
    }

    const generateConfig = () => {
        setConfig(!config)
    }

    useEffect(() => {
        setElements((els) =>
          els.map((el) => {
            if (el.id === nodeId) {
              el.data = {
                ...el.data,
                label: nodeName,
              };
            }
            
            return el;
          })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [nodeName]);

    useEffect(() => {
        // console.log(config)
      },
      [nodeId, config, workflowName, orb, workflowSubmission])


    return config === false ? (
        <div>
            <div className="dndflow">
                <ReactFlowProvider>
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow
                            elements={elements}
                            onLoad={onLoad}
                            onConnect={onConnect}
                            onElementClick={(event, element) => setNodeId(element.id)}
                            connectionLineType= "bezier"
                            onElementsRemove={onElementsRemove}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            style={{width: '100%', height: '90vh'}}
                        >
                            <Controls />
                            <Background 
                                color='#888'
                            />
                        </ReactFlow>
                        </div>
                    <Sidebar updateNode={updateNode} updateOrb={updateOrb} 
                    generateConfig={generateConfig} setWorkflow={setWorkflow} 
                    workflowName={workflowName} workflowSubmission={workflowSubmission}/>
                </ReactFlowProvider>
        </div>
        </div> 
    ) : (
        <Config elements={elements} workflowName={workflowName} orb={orb}/>
    )
}

export default DrawPipeline;