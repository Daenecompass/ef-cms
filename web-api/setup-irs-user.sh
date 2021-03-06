#!/bin/bash -e
ENV=$1
REGION="us-east-1"

CURRENT_COLOR=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"deployed-stack"},"sk":{"S":"deployed-stack"}}' | jq -r ".Item.current.S")

restApiId=$(aws apigateway get-rest-apis --region="${REGION}" --query "items[?name=='${ENV}-ef-cms-users-${CURRENT_COLOR}'].id" --output text)

USER_POOL_ID=$(aws cognito-idp list-user-pools --query "UserPools[?Name == 'efcms-${ENV}'].Id | [0]" --max-results 30 --region "${REGION}")
USER_POOL_ID="${USER_POOL_ID%\"}"
USER_POOL_ID="${USER_POOL_ID#\"}"

CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "${USER_POOL_ID}" --query "UserPoolClients[?ClientName == 'client'].ClientId | [0]" --max-results 30 --region "${REGION}")
CLIENT_ID="${CLIENT_ID%\"}"
CLIENT_ID="${CLIENT_ID#\"}"

generate_post_data() {
  email=$1
  role=$2
  section=$3
  name=$4
  cat <<EOF
{
  "email": "$email",
  "password": "Testing1234$",
  "role": "$role",
  "section": "$section",
  "name": "$name"
}
EOF
}

response=$(aws cognito-idp admin-initiate-auth \
  --user-pool-id "${USER_POOL_ID}" \
  --client-id "${CLIENT_ID}" \
  --region "${REGION}" \
  --auth-flow ADMIN_NO_SRP_AUTH \
  --auth-parameters USERNAME="ustcadmin@example.com"',PASSWORD'="${USTC_ADMIN_PASS}")
adminToken=$(echo "${response}" | jq -r ".AuthenticationResult.IdToken")

curl --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${adminToken}" \
  --request POST \
  --data "$(generate_post_data "service.agent.test@irs.gov" "irsSuperuser" "irsSuperuser" "IRS Superuser")" \
    "https://${restApiId}.execute-api.us-east-1.amazonaws.com/${ENV}"
