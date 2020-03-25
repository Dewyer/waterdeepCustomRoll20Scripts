import { Command } from "./models";

var capturedLastRollTotal = 0;

export function handleUtilityCommands(msg:ChatEventData)
{
    //log(msg);
    if (msg.content.startsWith("!"))
    {
        let cmd = getMessageCommand(msg.content);
        //log(cmd);

        if (cmd.command === "!cr")
        {
            doCrCommand(cmd);
        }

        if (cmd.command === "!kicsigyogy")
        {
            doLesserHealing(cmd);
		}
		if (cmd.command === "!cs")
		{
			doCsCommand(cmd);
		}
    }
    tryCaptureRollResult(msg);

};

function doCsCommand(cmd:Command)
{
	let charName = cmd.args[0];
	let toEdit = cmd.args[1];
	let to = 0;
	let charId = getCharacterIdFromName(charName);
	if (!charId)
		return;
	let charAtr = getCharacterAttribute(charId,toEdit);
	if (!charAtr)
		return;

	if (cmd.args.length > 2)
	{
		if (cmd.args[2] === "roll")
		{
			log("roll by : " + capturedLastRollTotal);
			to = capturedLastRollTotal;
		}
		else if (cmd.args[2] === "max")
		{
			log("set to to max");
			to = parseInt(charAtr.get("max"));
		}
		else { to = parseInt(cmd.args[2]); }
	}
	(charAtr as any).set("current",to);
}

function tryCaptureRollResult(msg)
{
    if (msg.inlinerolls !== undefined)
    {
        if (msg.inlinerolls.length > 1)
        {
            let last = msg.inlinerolls[msg.inlinerolls.length-1];
            if (last.results)
            {
                let total = last.results.total;
                if (total !== undefined)
                {
                    capturedLastRollTotal = total;
                    log("new captured result :"+capturedLastRollTotal);
                }
            }
        }
    }
}

function doLesserHealing(cmd)
{
    let charName = cmd.args[0];
    let charId  = getCharacterIdFromName(charName);
    let hp = randomInteger(4) + randomInteger(4)+4;
    let ct = "Megiszik egy kicsi gyógyitalt és visszatölt 2d4+4 életerőt ami [["+hp+"]].";
    sendChat("character|"+charId,"/me "+ct);
    changeCharacterAttributeBy(charId,"hp",hp);
}


export function getMessageCommand(content) : Command
{
    let args = [];
    let command = "";
    let buffer = "";
    let lastChar = "";
    for (let ii = 0; ii < content.length; ii++)
    {
        let atChar = content[ii];
        if (command === "" && atChar === " ")
        {
            command = buffer;
        }
        else if (atChar === "{")
        {
            buffer = "";
        }
        else if (atChar === "}")
        {
            args.push(buffer);
            buffer = "";

        }
        else if (!(lastChar === "}" && atChar === " "))
        {
            buffer += atChar;
        }
        lastChar = atChar;
    }
    if (command === "")
    {
        command = buffer;
    }

    return { command: command, args: args };
}

function doCrCommand(cmd)
{
    let charName = cmd.args[0];
    let toEdit = cmd.args[1];
    let by = -1;

    if (cmd.args.length > 2)
    {
        if (cmd.args[2] === "roll")
        {
            log("roll by : "+capturedLastRollTotal);
            by = capturedLastRollTotal;
        }
        else{by = parseInt(cmd.args[2]);}
    }

    //log(charName);
    //llog(toEdit);
    let charId = getCharacterIdFromName(charName);
    //class_resource
    changeCharacterAttributeBy(charId,toEdit,by);
}

export function getCharacterAttribute(charId:string,attribute:string) : Attribute | undefined
{
    let atribs = filterObjs((obj: Attribute) => obj.get("_type") === "attribute" && obj.get("_characterid") === charId && obj.get("name") === attribute) as Attribute[];
    if (atribs.length > 0)
    {
        return atribs[0];
    }
    return undefined;
}

function changeCharacterAttributeBy(charId,atribStr,by)
{
    let atrib = getCharacterAttribute(charId,atribStr);
    if (atrib !== undefined)
    {
        try{
            //log(atrib);
            let mx = parseInt(atrib.get("max"));
            let cur = parseInt(atrib.get("current"))
            let newVal = Math.min(cur + by, mx);
			(atrib as any).set("current", newVal+"");
        }
        catch (ex)
        {
            sendChat("UtilityApi","Coudn't change attrib value!");
        }
    }
}

export function getCharacterIdFromName(name) : string | undefined
{
    let chars = filterObjs((obj:Character) => obj.get("_type") === "character" && obj.get("name") === name) as Character[];
    if (chars.length > 0)
    {
        return chars[0].get("_id");
    }
    else
    {
        return undefined;
    }
}

function min(a,b)
{
    return a >= b ? b : a;
}
