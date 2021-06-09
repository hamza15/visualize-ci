import { React } from 'react'
import YAML from 'yaml'

const Config = (props) => {
  
    const jsonObject = {
        version: "2.1",
        jobs: {
        },
        workflows: {
        }   
    }

    function isConnector(connector) {
        if ('source' in connector) {
            return false
        }
        return connector
    }

    const elements = props.elements
    let jobNames = elements.filter(isConnector)
    console.log(jobNames)
    let jobs = []
    // const jobNames = props.elements
    let count = 0
    jobNames.forEach((x, i) => {
            let jobName = `${x.data.label}`

            //job addition
            if (jobName in jsonObject.jobs) {
                jobName = jobName + `${count++}`
            }
            jobs.push(jobName)
            jsonObject.jobs[jobName] = {
                "docker": [
                    {
                        "image": "circleci/ruby:2.4-node"
                    }
                ],
                "steps": [
                    "checkout",
                    {
                        "run": "echo \"Hello World\""
                    }
                ]
            }

            //workflow addition
            jsonObject.workflows[props.workflowName] = {
                "jobs" : jobs
            }
        }
    )

    const doc = new YAML.Document();
    doc.contents = jsonObject;

    return (
        <div>
            {/* <h1>{mapJobs}</h1> */}
            {/* <div className="mt-28"><pre>{JSON.stringify(jsonObject, null, 2) }</pre></div> */}


            <div><pre>{YAML.stringify(doc, null, 2)}</pre></div>
            
        </div>
    )
}

export default Config;