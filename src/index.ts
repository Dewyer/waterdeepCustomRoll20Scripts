import * as rollfx from "./rollfx";
import * as tavern from "./tavern";
import * as utility from "./utility";

//Message handler
on("chat:message", function (msg)
{
    tavern.handleTavernCommands(msg);
    utility.handleUtilityCommands(msg);
    rollfx.handleCustomFx(msg);
});
