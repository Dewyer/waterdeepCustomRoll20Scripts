import {getMessageCommand, getCharacterAttribute, getCharacterIdFromName} from "./utility";
import { DefaultTavernState } from "./assets";
import { TavernState, Command, TavernItemDef } from "./models";

const TAVERN_NAME = "Egészséges Kecske Kocsma";
const SERVER_DC = 12;
const GUARD_DC = 14;
const INN_DC = 10;

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
		if (cmd.command === "!kocsma-futtat")
		{
			handleRunning(cmd);
		}

		if (cmd.command === "!kocsma-repu")
		{
			changeTavernRepu(cmd);
		}
    }
}

function changeTavernRepu(cmd:Command)
{
	log("repu ");
	log(cmd);
	if (cmd.args.length >= 1)
	{
		let state = getTavernState();
		let by = parseInt(cmd.args[0]);
		let newState = Object.assign({},state);
		newState.reputation += by;
		setTavernState(newState);
		sendChat(TAVERN_NAME,"Reputáció frissítve!");
	}
}

function handleRunning(cmd:Command)
{
	let state = getTavernState();
	let halfRep = (state.reputation / 2);
	let min = state.reputation-halfRep;
	let max = state.reputation+halfRep;
	let people = getNormalizedRandom() * (max-min)+min;
	let pplChecks = Math.floor(people/10)+1;

	let repuMod = 0;
	let failedServer = 0;
	let failedGuard = 0;
	let failedInn = 0;
	for (let checkI = 0; checkI < pplChecks;checkI++)
	{
		let server = randomInteger(20)+state.serverModifier >= SERVER_DC;
		let guard = randomInteger(20) + state.guardModifier >= GUARD_DC;
		let inn = randomInteger(20) + state.innkeeperModifier >= INN_DC;

		if (server)
		{
			repuMod += randomInteger(4);
		}
		else
		{
			repuMod -= randomInteger(6)
			failedServer++;
		}
		if (guard)
		{
			repuMod += randomInteger(4)
		}
		else
		{
			repuMod -= randomInteger(6)
			failedGuard++;
		}

		if (inn)
		{
			repuMod += randomInteger(6)
		}
		else
		{
			repuMod -= randomInteger(8)
			failedInn++;
		}
	}

	let money = 0;
	let newState = Object.assign({},state);
	newState.reputation = Math.max(1,newState.reputation+repuMod);
	let drank = 0;

	for (let ppI = 0; ppI < people;ppI++)
	{
		let drink = getRandomDrinkThatsInStock(newState);
		if (state.inv[drink] > 0)
		{
			money += state.defs[drink].sellPrice;
			newState.inv[drink]--;
			drank++;
		}
	}

	setTavernState(newState);
	sendChat(TAVERN_NAME,`&{template:default} {{name=Kocsma}} {{Pénz keresve=${money} gp}} {{Emberek kiszolgálva=${drank} fő}} {{Chekkek=${pplChecks} db}} {{Kiszolgálói chekkek=${pplChecks-failedServer}/${pplChecks}}} {{Őr chekkek=${pplChecks-failedGuard}/${pplChecks}}} {{Kocsmáros csekkek=${pplChecks-failedInn}/${pplChecks}}} {{Új reputáció=${newState.reputation}}}`);
	displayInventory();
}

function getNormalizedRandom() : number
{
	return (randomInteger(101) - 1) / 100.0;
}

function getRandomDrink(defs:{[key:string]:TavernItemDef}) : string
{
	let chance = getNormalizedRandom();
	let at = 0;
	for (let ii in defs)
	{
		let nextMax = at+defs[ii].chance;

		if (chance >= at && chance < nextMax)
		{
			return ii;
		}
	}
	return "shadow-ale";
}

function getRandomDrinkThatsInStock(state:TavernState) : string
{
	let cc = 0;
	while(true)
	{
		let choosen = getRandomDrink(state.defs);
		if (state.inv[choosen] !== 0)
		{
			return choosen;
		}
		cc++;
		if (cc >= 100)
		{
			return "shadow-ale";
		}
	}
}

function handleBuyingStock(cmd:Command)
{
    if (cmd.args.length >= 3)
    {
        let who = cmd.args[0]
        let what = cmd.args[1];
		let howMuch = parseInt(cmd.args[2]);
		let playerMoney = getPlayerMoneyAttrib(who);
		let oldState = getTavernState();
		let buyDef = oldState.defs[what];
		let totalCostOfPurchase = buyDef.buyPrice.price * howMuch;
		let playerMoneyNumber = parseInt(playerMoney.get("current"));

		if (oldState.inv[what] !== undefined)
        {
			if (canPlayerAffordItem(totalCostOfPurchase,playerMoney))
			{
				(playerMoney as any).set("current", playerMoneyNumber-totalCostOfPurchase+"");
				addStock(what,buyDef.buyPrice.for*howMuch);
				sendChat(TAVERN_NAME,`&{template:default} {{name=Kocsma}} {{Megvéve=${what}}} {{Hány hordó=${howMuch} hordó}} {{Hány kiszerelés=${howMuch*buyDef.buyPrice.for} kiszerelés}} {{Mennyibe került=${totalCostOfPurchase} gp}}`);
			}
			else
			{
				sendChat(TAVERN_NAME,`Nincs elég pénzed ezt megvenni :'( Ennyi pénzed van: ${playerMoneyNumber} gp, ennyibe került volna: ${totalCostOfPurchase} gp`)
			}
		}
		else
		{
			sendChat(TAVERN_NAME,"Ilyen ital nem létezik!")
		}
	}
}

function addStock(what:string,much:number)
{
	let tavernState = getTavernState();
	let newState = Object.assign({},tavernState);
	if (newState[what] === undefined){
		newState[what] = much;
	}
	else{
		newState.inv[what] += much;
	}
	setTavernState(newState);
}

function canPlayerAffordItem(cost:number , playerMoney:Attribute) : boolean
{
	return parseInt(playerMoney.get("current")) >= cost;
}

function getPlayerMoneyAttrib(playerName:string) : Attribute
{
	let charId = getCharacterIdFromName(playerName);
	let atrib = getCharacterAttribute(charId,"gp");
	log(atrib);
	return atrib;
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
        items.push(`{{${kk}=${state.inv[kk]} kiszerelés}}`);
    }
	let body = `&{template:default} {{name=Kocsma}} ${items.join(" ")}`

    sendChat(TAVERN_NAME,body);
}

function getStateAtrib() : Attribute
{
    let tavern = getTavernCharacter();
    let tid = tavern.id;
    let atrib = filterObjs((obj:any) => obj.get("_type") === "attribute" && obj.get("_characterid") === tid && obj.get("name") === "state") as Attribute[];

    return atrib[0];

}

function getTavernState() : TavernState
{
    let atrib = getStateAtrib();
    let ss = atrib.get("current");
    if (ss !== undefined){
        return JSON.parse(ss) as TavernState;
    }
    return DefaultTavernState;
}

function setTavernState(news:TavernState)
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
