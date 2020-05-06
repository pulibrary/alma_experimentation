const requestHandler = async function(event, context) {
  console.log("Message received: " + JSON.stringify(event.body));
  return JSON.stringify(event.body)
}

exports.handler = requestHandler
