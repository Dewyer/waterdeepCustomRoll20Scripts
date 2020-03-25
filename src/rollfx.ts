import { CustomEffects } from "./assets";

export function handleCustomFx(msg:ChatEventData)
{
    if ((msg.rolltemplate === "dmg") && msg.inlinerolls)
    {
        log("will do fx")
        //we need an fx
        let token = getSenderToken(msg);
        if (token)
        {
            let description = msg.content.split("{{desc=")[1].split("}}")[0];
            if (description.includes("#"))
            {
                let effect = description.split("#")[1].toLowerCase()
                log(effect);
                let x = token.get("left");
                let y = token.get("top");
                if (CustomEffects.hasOwnProperty(effect))
                {
                    log("custom effect");
                    log(CustomEffects[effect]);
                    log(x);
                    log(y);
                    spawnFxWithDefinition(x, y, CustomEffects[effect])
                }
                else
                {
                    //spawnFx(token.left+(token.width/2),token.top+(token.height/2),effect);
                    log("Rolling normal effect")
                    spawnFx(x, y, effect);
                }
            }
        }
    }
}

function getCharacterIdFromName(name)
{
    let chars = filterObjs((obj:Character)=>obj.get("_type") === "character" && obj.get("name") === name) as Character[];
    if (chars.length >0)
    {
        return chars[0].get("_id");
    }
    else
    {
        return undefined;
    }
}

function getSenderToken(msg) : Graphic
{
    let playerPageId = Campaign().get('playerpageid');
    let representerName = msg.content.split("charname=")[1].trim();
    let representerId = getCharacterIdFromName(representerName);

    let playerTokens = filterObjs((obj:Graphic) => 
    {
        if (obj.get("_type") === "graphic" && obj.get("_subtype") === "token" && obj.get("_pageid") === playerPageId)
        {
            //all tokens on this page
            if (obj.get("represents") === representerId)
            {
                return true;
            }
        } 
        return false;
    });
    
    if (playerTokens.length > 0)
    {
        return playerTokens[0] as Graphic;
    }
    return undefined;
}