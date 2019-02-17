"use strict";
// Curated selection from http://www.hahnlibrary.net/rpgs/101dms.html

let sayings = [
    "You actually put on the ring?!",
    "Okaaaaaaaay...",
    "Oh no...",
    "This is going to hurt.",
    "HAHAHAHAHAHAHAHAHAHA... Man, it sucks to be you!",
    "I modified this creature a little...",
    "You can bring any character you want... it probably won't come out alive.",
    "He gets up again and starts advancing on the party.  He looks unwounded.",
    "20 more Thri-Kreen come around the dune.",
    "Evidently that wasn't the [lich's] phylactery.",
    "Oh...don't mind these rolls...all just unimportant...",
    "Plot twist time...",
    "The ring won't come off.",
    "You feel compelled to <insert verb here>.",
    "Ooooo, well. <pause> How many hit points did you say you had left?",
    "Complete silence while he stares blankly at me.",
    "You do what?!!  Okay, everyone have 4d6 handy?",
    "10...9...8...7...6...5...4...3...2...1...",
    "I need some more d6's.",
    "I really didn't expect you guys to do that. *sigh*",
    "Did you not hear me when I said EMANATING EXTREME EVIL?!  That means DON'T TOUCH!",
    "Hey, another crit!",
    "Eek! Ran out of coffee.",
    "...and then you notice her eyes are glowing.",
    "How many hit points did you say you had left?",
    "Whose miniature is that on the far right?  Ewwww, sorry.",
    "No, you saved--that *is* half.",
    "Can I borrow all your dice?",
    "Can I borrow EVERYONE'S dice?",
    "Explain to me **EXACTLY** what you are doing.",
    "Read this note.  Don't tell anyone else what happened.",
    "What level were you?",
    "You aren't, by any chance, immune to...?",
    "Take a few minutes to check your character sheet.  See if you can squeeze out another save bonus.",
    "Don't worry about the damage.  Just lie still for a while.  We'll see how things go.",
    "You are under a magical compulsion.  Direct your most effective attack against <insert PC>.",
    "Roll 4d6 six times and drop the lowest die each time.",
    "I need to speak with you...alone.",
    "Give me your character sheet.",
    "Check your perception please. You failed? I guess you don't sense this coming...",
    "You will advance at the rate of one x.p. per game.",
    "I hope y'all didn't create big backgrounds, because we're playing Tomb of Horrors!",
    "Hang on, I gotta look this one up!!",
    "Tell me *EXACTLY* where you are standing when you do this.",
    "SIGH. . .",
    "You don't find any traps.",
    "You don't find the trap.",
    "You don't seem to find anything.",
    "Heheheh....cool.",
    "*cough*....OOOOOkay.",
    "What WAS your Con?",
    "Take X damage. Permanently.",
    "You do that? I'll get back to you.",
    "Uhm...Tim...how about going out for a soda run?",
    "Now that's gonna hurt!",
    "What's your standing with your god right now?",
    "I didn't know those things hit so hard...",
    "You didn't like that character, did you?",
    "Oh dear.  I'm going to need more dice for this.",
    "Come with me and bring your dice.",
    "I forgot and left all my stuff home, so I'll wing it.",
    "You think you saw a shadow moving around the corner.",
    "You think you heard some indistinct noise from your side.",
    "You feel a sudden chill.",
    "It smells kinda funny in here.  Roll a d20 please..",
    "As far as you can tell, the room appears to be empty.",
    "Don't get too comfortable, this won't last long.",
    "...So then Odin says 'Oh YEAH?!? Well take THIS...'",
    "Then your new, jet-black sword says...",
    "Then the demon says...",
    "You realize that the sun seems to be getting a lot bigger...",
    "Wow! How unlucky can you guys get...?",
    "Oh god! Please tell me someone can beat my initiative 2.",
    "But I'm Sure I gave out the XP Last week!",
    "You know, I've never managed to run this dungeon All the way through...",
    "Right, it's the middle of the night and you're all asleep...",
    "Where were you keeping that vial?",
    "Nothing happens.",
    "Hand me that calculator.",
    "Oh crap... That's the last of you, isn't it?"
];

exports.rand = function() {
    return sayings[Math.floor(Math.random() * sayings.length)];
};