# How-to project to setup notifications in Slack for CI

This is an example project of how to setup a basic app and push notifications to set app.

## Dependencies

- nodejs (>=v18.6.0)
- Slack workspace
- Basic understanding of [Slack API](https://api.slack.com/)

## How to create a slack app

1. Go to [create an app](https://api.slack.com/apps?new_app=1)
2. Choose *From scratch* or use the supplied manifest 
3. From scratch
   1. Fill in App name & select workspace
   2. Select OAuth & Permission
   3. Add scopes:  chat:write, incoming-webhook, links:write
   4. Install to workspace and select a channel (you can add more later)
   5. Verify installation has worked by going to *incoming webhooks* and executing the curl command.
   6. Go to *basic information* to add an app icon alter the background etc.
4. Use supplied Manifest (simply import text below)
5. Right click on the channel > view channel details > integrations > install your app
6. How to get channel ID.  Click on a message in a channel > press 3 dots > copy link https://${WORKSPACE}.slack.com/archives/{CHANNEL_ID}/{MESSAGE_ID}

## Import app manifest file

Note: I have not enabled secret rotation or socket mode but you may need to review these depending on NFRs.

```yaml
display_information:
  name: CI Notifications
features:
  bot_user:
    display_name: CI Notifications
    always_online: false
oauth_config:
  scopes:
    bot:
      - chat:write
      - incoming-webhook
      - links:write
settings:
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

## Verify slack app receives notifications

```sh
# See incoming webhooks
curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/${WORKSPACE_ID}/${TOKEN}
```

## How to publish notifications to the app using nodejs

```sh
# Print sample messages to a channel your app is a member of
SLACK_TOKEN=${SLACK_TOKEN} CHANNEL_ID=${CHANNEL_ID} node slackMessage.ts
```
