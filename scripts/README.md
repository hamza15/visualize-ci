## PR Push Helper

This scripts folder contains a helper utility to create a PR (for demo purposes) into a target gitops folder
## Caveats

Right now this Script is hardcoded to the hamza15/kustomize-argo repo filesystem. But it serves as a proof of concept where the outputs of harness can be an input to a GitOps flow :) 

## Local Usage

`./create_pr.sh -t=<token> -o=<target repo owner> -r=<target repo> -i=<image you want updated> -b=<base branch>`

### Flags
- `-i/--image` is the full image you want you update inside the target repo
- `-b/--base` is the base branch you want the PR to be based off of
- `-t/--token` is the github token used to authenticate with the Github Rest API
- `-o/--owner` is the Github Owner of the target repo the PR is being made in
- `-r/--repo` is the Github Repo of the target repo the PR is being made in

## Docker

Build a docker container with `make build` (requires `make` obviously)

Run with `docker run pr-push:${PR_TOOLS_TAG} -t=.. -b=.. ...`