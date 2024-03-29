---
layout: post
title: What determines the wild encounter rate in Pokémon?
date: 2020-4-3
---

![An encounter in Pokémon Emerald](/img/Pokemon/title.webp)
*Oh, come on.*

I was playing through Pokémon Emerald recently, but got _really_ turned off by the sheer volume of random encounters. It was way higher than I remembered as a wee elementary school kid, but I couldn't find any hard data on how the encounter rate was determined. Not even on [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page), a Pokémon wiki with ridiculously detailed documentation of every last aspect of every game.

That's when I stumbled upon a [GitHub project that hosts a disassembly of Pokémon Emerald](https://github.com/pret/pokeemerald). I can read code, I'm stuck inside indefinitely due to a global catastrophe, and I need something to do. Let's read some 16-year-old C code!
<!--more-->
### TL;DR

If all you care about is the final encounter rate, it's 11% for most outdoor land areas like tall grass and desert sand, 6% for most caves and the like, and 2.2% when Surfing. There are a bunch of modifiers to these figures, though, so read on if you care about those.

### Long Form

Hey, cool, you stuck around! Let's get into it. The entry point I'm using is [`StandardWildEncounter()` in `src/wild_encounter.c`](https://github.com/pret/pokeemerald/blob/f1cccc975baef9f000c24381c65bab31104e8c47/src/wild_encounter.c#L522) if you'd like to follow along. Huge thanks to all the community members who did the actual legwork of going from autogenerated, decompiled ASM to clean, formatted C with sane variable names. There's no way I could have done this without them.

First, if something is globally blocking all wild encounters, we don't generate one. Duh. I couldn't find anywhere in the code where this flag is set, though, so it's totally possible this is a leftover from a debug build or a scrapped feature.

If we haven't been globally blocked from encounters, we next try to handle the special cases: the [Battle Pike](https://bulbapedia.bulbagarden.net/wiki/Battle_Pike) and [Battle Pyramid](https://bulbapedia.bulbagarden.net/wiki/Battle_Pyramid). These broadly follow the same rules as normal wild encounters, but have special rules that affect the spawn list used and the level of the generated Pokémon. Bulbapedia does a great job of explaining how these work.

Now let's look at the rules for generating a "land battle", which is defined by a battle coming from a tile that can generate encounters, but isn't surfable. Examples of this are tall grass, caves, and the deep sand found in the desert on Route 111. Encounters generated by Surfing, Diving, Rock Smashing, Sweet Scent, and fishing use different sets of rules that we'll get into later.

The first interesting find is a line that gives a 40% chance to skip generating an encounter on the player's first step into encounter-generating terrain from safe terrain. Thanks, Game Freak! If we didn't luck out on our first step check, we next move to the main encounter check.

### The Core Encounter Rate

The first piece of the equation is the base encounter rate for the area. Most external areas' base encounter rate is `20` (think routes), and most internal areas' base rate is `10` (caves and other dungeons). Exceptions include the Safari Zone at `25`, Route 119 at `15`[^1], Seafloor Cavern and Cave of Origin at `4`, and the mostly-unused Altering Cave at `7`.

This rate is first multiplied by `16`. I imagine this is done so that all the following modifiers will actually have an effect, since some of the base encounter rates are small. In order, all these modifiers are applied:

| Modifier                                                | Multiplier |
|---------------------------------------------------------|------------|
| Being on a bike                                         | 80%        |
| Having played the White Flute                           | 150%       |
| Having played the Black Flute                           | 50%        |
| Lead Pokémon has a Cleanse Tag                          | 66%        |
| Lead Pokémon has the Stench ability (in Battle Pyramid) | 75%        |
| Lead Pokémon has the Stench ability (everywhere else)   | 50%        |
| Lead Pokémon has the Illuminate ability                 | 200%       |
| Lead Pokémon has the White Smoke ability                | 50%        |
| Lead Pokémon has the Arena Trap ability                 | 200%       |
| Lead Pokémon has the Sand Veil ability in a sandstorm   | 50%        |

The resulting value is capped at `2880`. A value is randomly generated in the range `[0, 2880)` and compared to the modified encounter rate. If the encounter rate is greater than the randomly-generated number, the game continues to the next step. Otherwise, we're safe.

Some observations from this function:

* Holy crap, being on a bike actually reduces the encounter rate a bit! You'll end up having more encounters per minute because you're going faster, but if you want to get from point A to point B with as few battles as possible, a bike is the way to go.
* Running doesn't affect the encounter rate, at least not in Emerald. Apparently later games change this.
* The lead Pokémon's held item and ability takes effect even if it's fainted.
* Stench has a reduced effect in the Battle Pyramid, but White Smoke doesn't. Even though White Smoke has an effect in battle and Stench doesn't. Maybe Game Freak just felt bad for poor Torkoal (the only Pokémon with White Smoke in Gen 3).
* If you're in the Safari Zone playing a White Flute, and your lead Pokémon has the Illuminate ability, your modified encounter rate would be `1200`, giving you a brutal 41% chance to encounter a wild Pokémon per step.
* On the other hand, playing the Black Flute while biking through the Cave of Origin with a lead Pokémon with the Stench ability and a Cleanse Tag will give you a modified rate of `8`, or a 0.27% chance.
* The same setup in a normal tall grass area gives a modified rate of `42`, or 1 in 69[^2] (1.4%), while doing it in a cave would give you `21`, or 0.7%. Or, instead of being a reeking, flute-playing cyclist, y'know, use a Repel. (More on those later.)

### Choosing What to Fight

If we've gotten this far, the game has decided that it wants us to fight _something_, but hasn't decided what yet. There are three different types of wild encounters the game can throw at you: roamers, mass outbreaks, and normal encounters.

In Emerald, Latios and Latias roam around the world after defeating the Elite Four for the first time. If they're in your area, the game tries to start a battle with them first, with a 25% chance to succeed. Passing the check means it's time to break out the Sleep Powder and Quick Balls, 'cuz it's Latixs-catching time! That is, unless you're wearing a Repel and the first conscious, non-egg Pokémon in your party is a higher level than the roamer. In that case the game gives up on generating an encounter for this step and you'll continue on your way unmolested by Trainerless Pokémon.

If we didn't get lucky and pass the roamer check, the game next looks for [mass outbreaks](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_outbreak#Generation_III). These are events announced on TV that cause a 50% chance to encounter a specific species of Pokémon, at a specific level, on a specific Route, for the rest of the day after the program is watched. Passing the roll will start a battle with a Pokémon of the specified species and level, assuming you also pass a Repel check. The rest of the stats will be randomly determined in the same way as a normal wild Pokémon.

If we're still looking for a wild Pokémon to face, the game tries to generate one from the area's encounter table. The encounter table for an area includes a list of the Pokémon that can appear in the area, the range of levels they can be found at, and the percent chance they have to be selected from the table. They're all [readily available on Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Hoenn_Route_120#Generation_III) if you're looking for a specific 'mon. In most cases, the game randomly chooses a species and level from this table, then generates IVs, a gender, and a nature.

But this is Pokémon, so naturally there are a ton of modifiers to this otherwise-simple procedure. First, the game checks if the lead Pokémon has Magnet Pull or Static as its ability. If so, the game has a 50% chance to choose a Steel- or Elecric-type Pokémon from the encounter table, respectively. Otherwise, it chooses randomly from the weighted table.

Next, it generates a level. Usually this level is uniformly distributed within the range for the area for that species, but if the lead Pokémon has Pressure, Vital Spirit, or Hustle, there's a 50% chance to immediately choose the highest value in the range.

Our encounter is almost ready! Now the game does another Repel check, followed by the "Discount Repel" ability check: if the lead Pokémon has Pressure, Intimidate, or Keen Eye and the generated level is at least 5 less than the lead's own level, there's a 50% chance the encounter is scrapped. Interestingly, the roamer and mass outbreak routines include the Repel check, but skip the ability check.

If we haven't repelled the Pokémon in one way or another, the game finally generates the rest of the wild Pokémon's parameters. The IVs are totally random, but the gender and nature are not in certain cases. If the lead Pokémon has the Cute Charm ability, there's a 66% chance to generate the wild 'mon with the opposite gender of the lead if the chosen species can be that gender. In the Safari Zone, a nearby filled Pokéblock feeder has an 80% chance to cause the generated Pokémon to have a nature that would like the Pokéblock in the feeder. Finally, a lead with the Synchronize ability will give a 50% chance to generate a Pokémon with the same nature as the lead.

At long last, our rival has been determined, and the battle begins. Whew.

### What About the Other Battle Types?

They're broadly similar to land battles. I'll cover them rapid-fire, only mentioning the ways in which they differ.

#### Surfing

* If Groudon and Kyogre are fighting in Sootopolis, there are no random encounters there.
* The base encounter rate of all water is `4`, except in the Safari Zone where it's `9`. This gives encounter rates of 2.2% and 5%, respectively.
* Surfing has its own encounter table in each area.
* Mass outbreaks don't occur, but you can still encounter the roamer.
* Magnet Pull has no effect, but Static still applies.[^3] 

#### Diving

* Identical to Surfing, including the `4` base encounter rate, except:
* Diving areas are totally separate from the routes under which they exist, so they have their own encounter tables.
* Can only trigger battles while in seaweed.
* Do not ask me how you can physically apply Repel underwater, but it still works.
* The code exists to encounter the roamer underwater, but it's never programmed to go there. This is an artifact of code reuse, not a scrapped event where Latios would appear when Diving.

#### Rock Smash

* Has its own encounter table.
* Either `20` or `25` base encounter rate, depending on the area.
* The encounter rate calculation ignores abilities, but bikes, flutes, and Cleanse Tag still apply.
* Mass outbreaks and roamers won't appear.
* Magnet Pull and Static have no effect.[^4]

#### Sweet Scent

* If you're on an encounter-generating tile when using Sweet Scent outside of battle, and the legendary battle in Sootopolis doesn't apply, you will get a battle regardless of Repel, abilities, etc.
* Uses the encounter table and logic of the terrain the player is standing on, including mass outbreaks and roamers.

#### Fishing

* Instead of a normal encounter rate calculation, there's a minigame to determine if an encounter occurs. It's pretty complicated, so maybe I'll dig into that in another post.
* If the player wins the minigame and is fishing into a tile that might contain a Feebas, there's a 50% chance to encounter one. Finding Feebas is also complicated, but [Bulbapedia has a good article on it](https://bulbapedia.bulbagarden.net/wiki/Hoenn_Route_119#Finding_Feebas).
* Otherwise, the game randomly chooses from the weighted list of species that corresponds to the rod used for the area, just like it would for land encounters.
* You'll never hook a roamer or a mass encounter Pokémon.

### How 'Bout Other Generations?

I've still got _plenty_ of time to kill, let's quickly check out the other gens. We've got [Red/Blue](https://github.com/pret/pokered) and [Crystal](https://github.com/pret/pokecrystal)[^5], both in beautiful Z80 ASM.

#### Gen 1

The first generation of Pokémon games naturally have the simplest encounter algorithm. The game generates a random number from `0` to `255`, then compares it to the encounter rate of the current area. If the random number is less than the encounter rate, a battle begins unless the player is using a Repel, but more on that in a sec. There are no held items, abilities, bike modifiers, or first-step grace periods to complicate things here.

All water in the whole game has an encounter rate of `5` while surfing, or 2%, while routes vary from `15` to `25` (6-10%), dungeons range from `10` to `15` (4-6%), and the Safari Zone is `30` (12%) throughout. A notable outlier is the basement of Cerulean Cave, where Mewtwo is encountered, which has a rate of `25` just to make getting to the legendary that much harder.

Once the game has decided to throw something at us, it generates the wild Pokémon's level. Again, this is dead simple. Each entry in the area's encounter table has a species and a level. The species and level are randomly pulled from the weighted encounter table, then compared to the lead Pokémon's level if Repel has been applied. It doesn't check if the lead is conscious, though, unlike every other generation. The entire wild encounter routine is only a few dozen instructions, compared to nearly a thousand lines of C in Emerald!

As a fun aside, there's only one Surfing encounter table for the whole game! It's populated entirely with Tentacool, with levels ranging from 5 to 40. A quick peek at Yellow shows that Game Freak realized how boring this was, introducing different water encounter tabels for different maps in that game.

Let's touch on fishing real quick, too. The Old Rod will always hook a level 5 Magikarp. The Good Rod has a one-in-three chance to catch something, chosen from a small, static list of encounters. Finally, the Super Rod also has a 50% chance to catch something, and this time it has a per-map encounter table.

That's, uh, that's it. Those are the only random wild encounters in the game. One more game to go!

#### Gen 2

Crystal's encounter code is clearly based on Gen 1's, and it starts with a pretty similar encounter rate check. This time, water's encounter rate ranges from `5` to `15`, routes range from `15` to `25`, and dungeons range from `5` to `15`. But remember, all second-generation Pokémon games came with a real-time clock in the cartridge, and dammit, they're gonna make use of it! All land encounter tables have three entries for encounter rates -- one each for morning, daytime, and evening -- but for whatever reason only Diglett Cave actually has different values in each (`5`, `2`, and `10`, respectively).

Once the game has determined the base encounter rate for the area, it has some modifiers to apply this time! If any Pokémon in the player's party are holding a Cleanse Tag or the radio is playing the Pokémon Lullaby, the encounter rate is halved, while listening to the Pokémon March or Ruins of Alph signal doubles it. These effects are cumulative, so listening to lullabies on the radio while holding a Cleanse Tag quarters the encounter rate, and the Tag and the other signals will cancel each other out. After applying these modifiers, it compares the result to a random byte and continues deciding what to fight if the byte is less than the modified encounter rate, just like Gen 1.

Roamers are in this game if the player's encountered the Legendary Beasts in the basement of the Burned Tower, and there's a `75/256` (29%) chance for the game to check for them before looking for regular wild Pokémon. If this initial check succeeds and you're not in the water (dogs aren't great swimmers), the game next randomly choose one of the three roamers to try to encounter. If the game chooses one that hasn't been captured or knocked out yet, and it's in the area, the game will throw you into an encounter with it. If the initial check fails, or the Beast the game has chosen has been defeated, it's time to look for regular wilds.[^6] [^7]

Deciding which Pokémon to face is a bit different this time around. On land, there're three weighted tables for each area, one for each time of day. But if the game has generated a [swarm](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_outbreak#Generation_II) in the area, it swaps the usual tables for the area with different ones that correspond with that swarm. Whatever the table may be, the game randomly chooses a species and level pair from it. If the game tries to start a battle with an Unown, but the player hasn't solved any Ruins of Alph puzzles yet, the encounter is scrapped.

On water, there's only one table per area for all 24 hours of the day, and it has fewer entries than the land tables. However, to mix things up, the game will randomly add between 0 and 4 levels to the wild Pokémon.[^8]

The game then attempts to make sure the species it's chosen is valid by making sure it's between entries 1 and 251, inclusive. I say attempts, because the programmers accidentally swapped two instructions and ended up writing a check to make sure the Pokémon's _level_ fell within that range instead. Needless to say, this doesn't actually do anything.

At last, a Repel check is performed. It's similar to Gen 3 in that it looks at the level of the first _conscious_ party Pokémon, instead of whatever's in the first slot. If Repel isn't saving you at this point, nothing is, and it's time to throw down with a stray animal. Have fun!

Fishing got a bit of an overhaul, and each rod has its own encounter table in each area. If you were sad about not having Surfing outbreaks, cheer up, because there are still fishing outbreaks! These work in much the same way as land outbreaks, causing fishing attempts in the outbreak-affected area to read from the outbreak table instead of the normal one.

In this generation, you can also encounter wild Pokémon by headbutting trees. [Bulbapedia has a comprehensive article on this](https://bulbapedia.bulbagarden.net/wiki/Headbutt_tree), go read that if you're interested. The only thing I have to add is that there are tables that decide which Pokémon will be asleep at different times of day, which is a neat touch.

Finally, I totally forgot that Rock Smash was a thing in this gen, but it is, and it can generate battles too. There's a 40% chance for one to occur when smashing a rock, and they all draw from the same encounter table. There's a 90% chance for a level 15-19 Krabby to fall out and a 10% chance to find a level 15-19 Shuckle.

### Conclusion

I killed around three evenings reading old code, and it was cool to peek behind the curtain of some of my favorite childhood video games. I might do another one of these if the mood strikes me -- maybe looking at battle AI, something that I could never find a pattern in. I suspect there's a lot of randomness, but probably less than [the AI in my AP Computer Science group project from 2011](https://github.com/karmeleon/pokedroid/blob/master/src/com/games/pokedroid/game/TrainerAI.java#L1521).

Also, I'm never doing anything with ASM again. Please, do not make me read another line.

[^1]: I believe this route is special since it's pretty lengthy and full of long stretches grass you can't walk around.
[^2]: nice
[^3]: There are no Steel types in any of the water encounter lists, and the only electric type is Chinchou (found only underwater).
[^4]: There aren't any Steel or Electric types in the Rock Smash encounter lists anyway.
[^5]: There's some funky shit going on with the Pokémon Gold repo. I can't make heads or tails of it, so hopefully Crystal is similar enough.
[^6]: Suicune isn't a roamer in Crystal, but the game still has a 1/3 chance to try to encounter it anyway, a check that will always fail. This means the effective chance to encounter a beast, given that it's in the area, is `25/256` or around 10%.
[^7]: Repels don't affect roamers in Gen 2.
[^8]: The game checks for water swarms, but none are ever generated, and the region of ROM that would hold their tables is empty.
