
export interface Command
{
    command:string,
    args:string[]
}

export interface TavernItemDef
{
	chance: number,
	sellPrice: number,
	buyPrice: { price: number, for: number }
}

export interface TavernState
{
	reputation: number,
	innkeeperModifier: number,
	serverModifier: number,
	guardModifier: number,
	inv: {[key:string]:number},
	defs: { [key:string] : TavernItemDef}
}

