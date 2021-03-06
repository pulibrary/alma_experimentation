const crypto = require('crypto');
const AWS = require('aws-sdk');
const client = new AWS.SecretsManager();
const validateSignature = function(event, secret) {
  var body = event.body;
  var hash = crypto.createHmac('SHA256', secret)
             .update(JSON.stringify(body))
             .digest('base64');
  return hash == event.signature
}
const { datadog, sendDistributionMetric } = require('datadog-lambda-js');

async function getSecret() {
  return client.getSecretValue({SecretId: "alma/sandbox/webhookSecret"}).promise().then((data) => {
    return JSON.parse(data.SecretString).key
  }).catch((err) => {
    console.log(err)
  })
}
const requestHandler = async function(event) {
  console.log("Message received: " + JSON.stringify(event.body));
  const secret = await getSecret()
  if(validateSignature(event, secret)) {
    sendDistributionMetric('alma.webhook.action', 1, 'environment:sandbox', `action:${event.body.action}`);
    return JSON.stringify(event.body)
  } else {
    throw "Signature Invalid"
  }
}

exports.handler = datadog(requestHandler);
