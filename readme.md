## roll-slack-bot
![roll-slack-bot](../assets/roll-slack-bot.png?raw=true)

NodeJS slack slash command integration. [template-slash-command-and-dialogs](https://github.com/slackapi/template-slash-command-and-dialogs/)

When you provide an invalid roll string the system will return with a random quote.
101 Things You Never Want To Hear Your DM Say... [link](http://www.hahnlibrary.net/rpgs/101dms.html)

### Usage
`/roll 2d20+5 5d6 2d20b1 [sign]`
The results will be gpg signed by adding "sign" in the roll command.

### Notes
Environment variables can be comma delimited to serve requests from multiple slack domains


### Version
0.5.0