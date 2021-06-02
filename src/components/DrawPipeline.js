import React, { useState, Fragment } from 'react';
import ReactFlow, {addEdge, Background, Controls} from 'react-flow-renderer';

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

const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
}

const DrawPipeline = () => {

    const [elements, setElements] = useState(initialElements)
    const [name, setName] = useState("")


    const addNode = () => {
        setElements(e => e.concat({
            id: (e.length+1).toString(),
            data: {label: `${name}`},
            position: {x: 100, y: 45} 
        }))
    }

    const onConnect = (params) => setElements(e => addEdge(params,e));

    return(
        <Fragment>
                <ReactFlow
                    elements={elements}
                    onLoad={onLoad}
                    onConnect={onConnect}
                    connectionLineType= "bezier"
                    // snapToGrid= {true}
                    // snapGrid={[16,16]}
                    style={{width: '100%', height: '90vh'}}
                >
                    <Controls />
                    <Background 
                        color='#888'
                    />
            </ReactFlow>

            <div>
                <input type="text" placeholder="Test Stage"
                onChange={e => setName(e.target.value)}
                name="title"/>
                <button type="button"
                onClick={addNode}
                >
                Add Stage
                </button>
            </div>
            </Fragment>
    )
}

export default DrawPipeline;