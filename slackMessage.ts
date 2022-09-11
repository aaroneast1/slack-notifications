// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require("@slack/web-api");
const slackToken = process.env["SLACK_TOKEN"];
const channelId = process.env["CHANNEL_ID"];
const dayjs = require('dayjs')
const util = require('util')


// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(slackToken, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});

function toHeaderJson(header) {
  return {
		"type": "header",
		"text": {
			"type": "plain_text",
			"text": header,
			"emoji": true
		}
	}
}

function toStatusJson(failed){
  let status = failed ? "FAILED" : "SUCCESS" 
  let thumbs = failed ? ":thumbsdown:" : ":thumbsup:" 
  var url = new URL("https://www.seekpng.com/png/small/0-4640_image-royalty-free-clipart-check-mark-green-check.png")
  
  if (failed == true){
    url = new URL("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpg1N236Qv4QXaYZfoAp2YC1s0EEKI8HblJodteta2FrKQTdwL1nDpHq8Rl4XZilDRl6E&usqp=CAU")
  }

  return {
		"type": "context",
		"elements": [
			{
				"type": "image",
				"image_url": url.href,
				"alt_text": "JOB " + status
			},
			{
				"type": "mrkdwn",
				"text": "*JOB "+status+"* "+thumbs+" "+thumbs
			}
		]
	}
}

function toWhoAndWhenJson(who, when){
  return {
		"type": "section",
		"fields": [
			{
				"type": "mrkdwn",
				"text": "*Who:*\n"+who
			},
			{
				"type": "mrkdwn",
				"text": "*When:*\n"+dayjs(when).locale("en-gb").format('DD-MMM HH:mm:ss A')
			}
		]
	}
}

function toReasonJson(reason){
  return {
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "*Reason:*\n```"+reason+"```"
		}
	}
}

function toGitCommitAndLogJson(commitUrl, jobLogUrl){
  return {
		"type": "actions",
		"elements": [
			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "View Git Commit",
					"emoji": true
				},
				"value": "click_me_123",
				"url": commitUrl.href,
				"action_id": "actionId-0"
			},
			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "View Job Log",
					"emoji": true
				},
				"value": "click_me_1234",
				"url": jobLogUrl.href,
				"action_id": "actionId-01"
			}
		]
	}
}

function buildCiMessage(header, failed, who, when, reason, commitUrl, jobLogUrl){
  let headerJson = toHeaderJson(header)
  let statusJson = toStatusJson(failed)
  let whoAndWhenJson = toWhoAndWhenJson(who,when)
  let reasonJson = toReasonJson(reason)
  let gitCommitAndLogJson = toGitCommitAndLogJson(commitUrl,jobLogUrl)

	if(failed){
		return [headerJson,statusJson,whoAndWhenJson,reasonJson,gitCommitAndLogJson]
	}else{
		return [headerJson,statusJson,whoAndWhenJson,gitCommitAndLogJson]
	}
}

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, blockArr) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await client.chat.postMessage({
      // The token you used to initialize your app
      token: slackToken,
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

let failMsg = buildCiMessage("Hello World CI Job", 
  true, 
  "Aaron East", 
  new Date(), 
  "ERROR: example failure message blah blah blah", 
  new URL("https://www.google.com"), 
  new URL("https://www.google.com"))

publishMessage(channelId, failMsg);

let successMsg = buildCiMessage("Hello World CI Job", 
  false, 
  "Aaron East", 
  new Date(), 
  "Build successful", 
  new URL("https://www.google.com"), 
  new URL("https://www.google.com"))

publishMessage(channelId, successMsg);
