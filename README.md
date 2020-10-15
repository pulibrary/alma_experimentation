# alma_experimentation

## Webhook Deploy Instructions

Run the following commands in the `webhook_monitor` directory.

* Install the AWS CLI: 
[Directions](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html)
* Set up a `figgy-deploy` AWS profile. You can get the AccessID/AccessKey from
`lpass show --all Shared-ITIMS-Passwords/Figgy/FiggyAWS`
* Configure the profile via `aws configure --profile figgy-deploy`
  - Set default region to us-east-1
  - Set default output format to json
* `sam deploy`
