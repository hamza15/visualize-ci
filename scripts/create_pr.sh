#! /bin/bash
# requires jq, base64, curl
# expects env vars $GITHUB_TOKEN
set -eo pipefail
echo "I'm  not ugly code"
for i in "$@"; do
  case $i in
    -i=*|--image=*)
      IMAGE="${i#*=}"
      shift # past argument=value
      ;;
    -t=*|--token=*)
      TOKEN="${i#*=}"
      shift # past argument=value
      ;;
    -r=*|--repo=*)
      REPO="${i#*=}"
      shift # past argument=value
      ;;
    
    -o=*|--owner=*)
      OWNER="${i#*=}"
      shift # past argument=value
      ;;
    -b=*|--base=*)
      BASE="${i#*=}"
      shift # past argument=value
      ;;
    -*|--*)
      echo "Unknown option $i"
      exit 1
      ;;
    *)
      ;;
  esac
done


if [ -z "$IMAGE" ]; then
 echo "Image not defined. Use --image=image:<tag> or -i=image:<tag>"
 exit 1
fi

# terrible regex but whatevs
if ! [[ "$IMAGE" =~ ([a-zA-Z0-9]{0,}/){0,1}[a-zA-Z0-9]{0,}:.+ ]]; 
then
  echo "Invalid Image format $IMAGE. Expected image:tag or org/image:tag"
  exit 1
fi

if [ -z "$TOKEN" ]; then
 echo "Token not defined. Use --token=<token> or -t=<token>"
 exit 1
fi

if [ -z "$REPO" ]; then
 echo "Repo not defined. Use --repo=<repo> or -r=<repo>"
 exit 1
fi 

if [ -z "$OWNER" ]; then
 echo "Repo Owner not defined. Use --owner=<owner> or -o=<owner>"
 exit 1
fi 

if [ -z "$BASE" ]; then
 echo "BASE branch not defined in target repo. Use --head=main or -h=master for exmaple"
 exit 1
fi 

IMAGE_SPLIT=(${IMAGE//:/ })
TAG=${IMAGE_SPLIT[1]}
# step 0 seeing if branch was already created
BRANCH_NAME="drone-ci-push-$TAG"
branch_resp=$(curl -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $TOKEN" https://api.github.com/repos/$OWNER/$REPO/git/ref/heads/$BRANCH_NAME)
BRANCH_ALREADY_EXISTS="YES"
if [[ $(echo "$branch_resp" | jq -r '.message') == "Not Found" ]]; then
    BRANCH_ALREADY_EXISTS="NO"
fi

#  step 1 create a branch in target repo
if [ "$BRANCH_ALREADY_EXISTS" == "NO" ]; then 
    resp=$(curl -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $TOKEN" https://api.github.com/repos/$OWNER/$REPO/git/ref/heads/$BASE)
    SHA=$(echo $resp | jq -r '.object.sha')
    echo "Creating branch $BRANCH_NAME at $USER/$REPO"
    curl -X POST -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $TOKEN" https://api.github.com/repos/$OWNER/$REPO/git/refs -d '{"ref":"refs/heads/'$BRANCH_NAME\"',"sha":"'$SHA'"}'
else
   echo "Branch $BRANCH_NAME already exists"
fi

FILE=".argocd-source-argocd-demo.yaml"

# step 2 write new argocd file
## this is gross because only replacing tag,
TEMPLATE=$(sed 's/{{ .Tag }}/'"$TAG"'/g' ./templates/$FILE.tmpl)

TEMPLATE_BLOB=$(echo $TEMPLATE | base64)

echo $TEMPLATE_BLOB

echo "Updating $FILE"
# not able to create files
# have to get repo contents first foer the file sha
contents_resp=$(curl -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $TOKEN" https://api.github.com/repos/$OWNER/$REPO/contents/dev/$FILE)
CONTENTS_SHA=$(echo $contents_resp | jq -r '.sha')
# # equally gross, hard coded file path to target repo :(
curl -X PUT -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $TOKEN" https://api.github.com/repos/$OWNER/$REPO/contents/dev/$FILE -d '\{\"message\":\"Harness Updating '$FILE'\",\"committer\":\{\"name\":\"Robot\",\"email\":\"harness@yourorg.com\"\},\"content\":\"'$TEMPLATE_BLOB'\", \"sha\": \"'$CONTENTS_SHA'\", \"branch\": \"'$BRANCH_NAME'\"\}'

# Step 3 Make PR
echo "Making PR"
curl -X POST -H "Accept: application/vnd.github.v3+json" -H "Authorization: token $TOKEN" https://api.github.com/repos/$OWNER/$REPO/pulls -d '{"title":"Automated GitOps Pull by Harness '$IMAGE'","body":"## Summary\nThis PR was generated by Harness for your GitOps workflow. It updates the deploy image to '$IMAGE'. Merge and watch the magic :fire:","head":"'$BRANCH_NAME'","base":"'$BASE'"}'
echo "Complete!"
