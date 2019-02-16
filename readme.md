## roll-slack-bot
![roll-slack-bot](../assets/roll-slack-bot.png?raw=true)

NodeJS slack slash command integration. [template-slash-command-and-dialogs](https://github.com/slackapi/template-slash-command-and-dialogs/)

When you provide an invalid roll string the system will return with a random quote.
101 Things You Never Want To Hear Your DM Say... [link](http://www.hahnlibrary.net/rpgs/101dms.html)

### Usage
`/roll 2d20+5 5d6 2d20b1 [sign]`
The results will be gpg signed by adding "sign" in the roll command.


D&D Character ability score rolling.
You have 6 Ability scores to roll for.
*Str*ength, *Dex*terity, *Con*stitution, *Int*ellect, *Wis*dom, and *Cha*risma.
Methods
- Standard Set `15,14,13,12,10,8`
- Point buy
- Dice Roll


Default
- 4d6 drop 1 by 6
- 3d6 by 6
- 5d6 drop 2 by 6
- 4d6 drop 1 by replace low 18
- 2d6+4 by 6
- 3d6 by 12 best six.
- 3d6 by 6 by 6.


Proposed vocabulary
```
/roll <type> <dice> <limits> <ordered> <replacelow>
/roll ability 4d6b3+5x7 l10u20 order
```


### Notes
Environment variables can be comma delimited to serve requests from multiple slack domains


### Version
0.5.0