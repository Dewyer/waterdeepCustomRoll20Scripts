import {getMessageCommand} from "./utility";
import { DefaultTavernState } from "./assets";
import { TavernState } from "./models";

const TAVERN_NAME = "Egészséges Kecske Kocsma";

export function handleTavernCommands(msg:ChatEventData)
{
    if (msg.content.startsWith("!"))
    {
        let cmd = getMessageCommand(msg.content);
        if (msg.content === "!ujkocsma")
        {
            getTavernCharacter();
        }
        if (msg.content === "!kocsma")
        {
            sendChat(TAVERN_NAME,"Hello ! :D");
            let state = getTavernState();
        }

        if (msg.content === "!kocsma-raktar")
        {
            displayInventory();
        }

        if (cmd.command === "!kocsma-dolgozok")
        {
            setDolgozok(cmd);
        }

        if (cmd.command === "!kocsma-vetel")
        {
            handleBuyingStock(cmd);
        }
    }
}

function handleBuyingStock(cmd)
{
    if (cmd.args.length >= 3)
    {
        let who = cmd.args[0]
        let what = cmd.args[1];
        let howMuch = parseInt(cmd.args[2]);
        let oldState = getTavernState();

        if (oldState.inv[what])
        {
            let buy = oldState.defs[what];
            sendChat(TAVERN_NAME,"asd")
        }
    }
}

function setDolgozok(cmd)
{
    if (cmd.args.length >= 3)
    {
        let ink = parseInt(cmd.args[0]);
        let serv = parseInt(cmd.args[1]);
        let guard = parseInt(cmd.args[2]);
        let oldState = getTavernState();
        let news = Object.assign({},oldState);
        news.innkeeperModifier = ink;
        news.serverModifier = serv;
        news.guardModifier = guard;

        setTavernState(news);
        sendChat(TAVERN_NAME,"Dolgozok beallitva : "+cmd.args.join(" "))
    }
}

function displayInventory()
{
    let state = getTavernState();
    let items = [];
    for (let kk in state.inv)
    {
        items.push(`{{${kk}=${state.inv[kk]}}}`);
    }
    let body = `&{template:simple} {{name=Kocsma}} ${items.join(" ")}`

    sendChat(TAVERN_NAME,body);
}

function getStateAtrib() : Attribute
{
    let tavern = getTavernCharacter();
    let tid = tavern.id;
    let atrib = filterObjs((obj:any) => obj.get("_type") === "attribute" && obj.get("_characterid") === tid && obj.get("name") === "state") as Attribute[];

    return atrib[0];

}

function getTavernState()
{
    let atrib = getStateAtrib();
    log(atrib);
    let ss = atrib.get("current");
    if (ss !== undefined){
        return JSON.parse(ss);
    }
    return {};
}

function setTavernState(news)
{
    let atrib:any = getStateAtrib();
    atrib.set("current",JSON.stringify(news));
}

function getDefaultTavernState() :TavernState
{
    return DefaultTavernState;
}

function getTavernCharacter()
{
    let existingTavern = findTavernCharacter();
    if (!existingTavern)
    {
        return createTavernCharacter();
    }
    return existingTavern;
}

function createTavernCharacter()
{
    let tavern = createObj("character",{
        name:"tavern",
        bio:"Autogenerated Trollskull tavern",
        inplayerjournals:"all"
    });

    createObj("attribute", { name: "state", current: JSON.stringify(getDefaultTavernState()), max: "", _characterid:tavern.get("_id")});
    return tavern;
}

function findTavernCharacter()
{
    let taverns = filterObjs(function (obj:any)
    {
        if (obj.get("_type") === "character" && obj.get("name") === "tavern")
        {
            return true;
        }
        return false;
    });

    if (taverns.length > 0)
    {
        return taverns[0];
    }
    else
    {
        return undefined;
    }
}