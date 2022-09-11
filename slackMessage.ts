// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require("@slack/web-api");
const ciFailMessage = require("./templates/message_template_ci_failure.json");
const ciSuccessMessage = require("./templates/message_template_ci_success.json");

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient("put-token-here", {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});


// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, blockArr) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await client.chat.postMessage({
      // The token you used to initialize your app
      token: "put-token-here",
      channel: id,
      blocks: blockArr
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

publishMessage("cloudpractice-test", ciFailMessage);
publishMessage("cloudpractice-test", ciSuccessMessage);
