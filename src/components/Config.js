import { React } from 'react'
import YAML from 'yaml'

const Config = (props) => {
  
    const jsonObject = {
        version: "2.1",
        orbs: {},
        jobs: {},
        workflows: {}   
    }

    var orbData = props.orb

    if (orbData === "Slack") {
        jsonObject.orbs = {
            "slack": "circleci/slack@4.0"
        }
    }
    else {
        var orb = "orbs"
        delete jsonObject[orb]
    }

    function isNode(connector) {
        if ('source' in connector) {
            return false
        }
        return connector
    }

    const elements = props.elements
    console.log(elements)

    let jobNames = elements.filter(isNode)
    console.log(jobNames)

    let dependencyObj = {}
    elements.forEach((x, i) => {
        elements.forEach((y, j) => {
            if (x.id === y.target) {
                let jobLabel
                jobNames.forEach((job, i) => {
                    if (job.id === y.source) {
                        jobLabel = `${job.data.label}`
                    }
                })
                console.log(`${x.data.label} requires ${jobLabel}`)
                let targetName = `${x.data.label}`
                dependencyObj[targetName] = [...dependencyObj[targetName], `${jobLabel}`]
            }
            else {
                if ('data' in x && !dependencyObj[`${x.data.label}`])  {
                    dependencyObj[`${x.data.label}`] = []
                }   
            }
        })
    })


    console.log(dependencyObj)

    let dependencyTree = {}
    let idsToJobs = (dependencyObj) => {
        for (var key in dependencyObj){
            if (dependencyObj[key].length === 0) {
                dependencyTree[key] = "none"
            }
            else {
                dependencyTree[key] = dependencyObj[key]
            }   
        } 
    }
    idsToJobs(dependencyObj)
    console.log(dependencyTree)

    let arr = []
    for (const [key, value] of Object.entries(dependencyTree)) {
        if (value === 'none') {
          arr.push(key)
        }
        else {
          let arr2 = []
          value.forEach((x, i) => {
            arr2.push(x)
          })
      
          let newObj = {}
          newObj[`${key}`] = {
            "requires": arr2
          }
          arr.push(newObj)
        }
      }

    console.log(arr)

    console.log(jobNames)
    let jobs = []
    let jobIds = []
    let count = 0
    jobNames.forEach((x, i) => {
            let jobName = `${x.data.label}`
            let jobId = `${x.id}`
            //job addition
            if (jobName in jsonObject.jobs) {
                jobName = jobName + `${count++}`
            }
            jobs.push(jobName)
            jobIds.push(jobId)
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
                    }, 
                ]
            }
            if (orbData === "Slack") {
                console.log(jsonObject.jobs[jobName].steps)
                jsonObject.jobs[jobName].steps.push({"slack/notify" : {
                    "custom": "{\n  \"blocks\": [\n    {\n      \"type\": \"section\",\n      \"fields\": [\n        {\n          \"type\": \"plain_text\",\n          \"text\": \"*This is a text notification*\",\n          \"emoji\": true\n        }\n      ]\n    }\n  ]\n}\n",
                            "event": "always"
                }})
            }

            // workflow addition
            jsonObject.workflows[props.workflowName] = {
                "jobs" : arr
            }
        }
    )

    const doc = new YAML.Document();
    doc.contents = jsonObject;

    return (
        <div className="min-h-screen md:flex md:justify-center bg-black">
            <div className="text-green-400"><pre>{YAML.stringify(doc, null, 2)}</pre></div>
            
        </div>
    )
}

export default Config;