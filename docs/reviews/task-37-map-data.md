# Task 37: the map data, a report

Written on 2026-11-17 for Arthur. Task 37 makes the map data of `public/data/map/` by the rules of section 15.9 of `docs/DESIGN.md`, and it adds the section "Places" to the Sources page. It builds no map.

Each number of this report is from the output of `node scripts/build-map.mjs <folder>`, run on 2026-11-17, or is a sum or a difference of numbers in that output. The folder is the temporary folder `C:\Users\alang\AppData\Local\Temp\claude\7ba447bc64673977\e77fcb88-5f99-4afb-81a1-addbaca8412a\scratchpad\map37`. It is not in the repository. The output is in that folder, in `build5.txt`. The numbers of the designer are from section 15 of `docs/DESIGN.md` and from step 6 of Task 37 in `docs/TASKS.md`.

## Step 1. The downloads

Claude downloaded the seven data files again, at the commits `7eb18a5` and `ca96624`. The size and the SHA-256 of each file are the values of the table "Downloads (Task 36 step 1)" of `docs/DATA-SOURCES.md`. The script reads six of them. It prints their size and SHA-256, and it stops if one differs from the table. It does not read `data/geometry.jsonl`. I compared the SHA-256 of `data/geometry.jsonl` by hand.

## Step 6. The numbers, with the numbers of the designer

### The region of each book

The script gives each book the region of the table of the designer in section 15.9. The script prints 0 differences.

| Region | Books |
|---|---:|
| `r1` | 15 |
| `r2` | 14 |
| `r3` | 7 |
| `r4` | 18 |
| `r5` | 7 |
| none | 5: Philemon, James, 1 John, 2 John, 3 John |

### The five books with no region at 90%

| Book | Verses in `r4` | The designer |
|---|---|---|
| Esther | 29 of 33 | 29 of 33 |
| Job | 6 of 14 | 6 of 14 |
| Ezekiel | 335 of 385 | 335 of 385 |
| Jonah | 9 of 11 | 9 of 11 |
| Nahum | 22 of 27 | 22 of 27 |

Each of the five opens `r4`. The numbers agree.

### Six books

| Book | `named` | With a position | Below 500 | The designer |
|---|---:|---:|---:|---|
| Exodus | 33 | 31 | 15 | 33, 31, 15 |
| Joshua | 432 | 431 | 196 | 432, 431, 196 |
| Ezekiel | 107 | 106 | 23 | 107, 106, 23 |
| Matthew | 38 | 38 | 6 | 38, 38, 6 |
| Acts | 107 | 107 | 4 | 107, 107, 4 |
| Proverbs | 1 | 1 | 0 | 1, 1, 0 |

The numbers agree. "With a position" includes the places inside a settlement. In the files, Exodus has 2 places with no position, "Holy Place" and "Most Holy Place". Joshua has 1 place inside a settlement, "Allon", and 1 place with no position, "Biziothiah".

### The places inside a settlement

50 places with verses are inside a settlement by rule 4. The report of Task 36 has 50. In Acts: Beautiful Gate and Solomon’s Portico. The numbers agree.

### The places with a `custom_lonlat`

5 places with verses have a location with a `custom_lonlat`: Beth-dagon 1, En-gannim 1, Kattath, Kitron, and Zanoah 2. The designer: 5. The data has 11 locations with a `custom_lonlat`. Each of the 5 positions moves by less than 0.002 degrees. Kattath and Kitron have the same location, Khirbet Qutteina, so they have the same position.

### The places with two locations at the highest score

5 places with verses: Bealoth 1, Bealoth 2, Brook of the Arabah, Chilmad, and Sela 3. The designer: 5. For each of the 5, the locations have different positions, and the script takes the first in `modern_associations`. All places of the data, with and without verses: 7.

### The places of each kind

The places with verses and a position that are not inside a settlement: 1,228.

| Kind | The script | The designer |
|---|---:|---:|
| place | 975 | 973 |
| region | 133 | 133 |
| mountain | 69 | 68 |
| water | 51 | 50 |
| Sum | 1,228 | 1,224 |

The cause of the difference: the designer counted with 54 places inside a settlement, by a rule of the designer that section 15.8 names, and the script uses rule 4 with 50. The sum differs by 4, and 54 minus 50 is 4. So I expect that 4 places that the rule of the designer left out are in the files: 2 of the kind "place", 1 "mountain", and 1 "water". I did not observe this. The rule of the designer is not recorded. The accuracy reviewer found a candidate, and the script prints it: rule 4 on each resolution of each identification of a place, not only on the resolution of its location. The candidate gives 54 places. The 4 more are Dragon Spring, "water"; Dura, "place"; Moreh 1, "place"; and The Lord Will Provide, "mountain". These kinds are the difference of the table. I do not know if the candidate is the rule of the designer. The files use rule 4.

### The data box of each region

| Region | The script, before the 0.2 degrees | The designer | In `index.json`, with the 0.2 degrees |
|---|---|---|---|
| `r1` | 30.3 to 40.4 E, 29.4 to 33.7 N | 30.3 to 40.4 E, 29.4 to 33.7 N | 30.1041 to 40.5959 E, 29.2 to 33.9 N |
| `r2` | 25.4 to 41.1 E, 26.6 to 35.1 N | 25.4 to 41.1 E, 26.6 to 35.1 N | 25.2458 to 41.2542 E, 26.3574 to 35.3426 N |
| `r3` | 17.1 to 34.9 E, 32.8 to 44.2 N | 17.1 to 34.9 E, 32.8 to 44.2 N | 16.8555 to 35.1445 E, 32.5608 to 44.4392 N |
| `r4` | 25.9 to 52.1 E, 21.8 to 44.2 N | 25.9 to 52.1 E, 21.8 to 44.2 N | 25.684 to 52.316 E, 21.6177 to 44.3823 N |
| `r5` | 7.5 to 42.5 E, 23.2 to 50.8 N | 7.5 to 42.5 E, 23.2 to 50.8 N | 7.2701 to 42.7299 E, 22.9569 to 51.0431 N |

The numbers agree to one decimal place. The script rounds the box with the margin outward to 0.0001 degrees, the grid of the coordinates of the region files.

### The bytes of the files

The script uses gzip at level 9.

| File | Bytes | With gzip | The designer, with gzip |
|---|---:|---:|---:|
| `regions/r1.json` | 12,390 | 5,288 | about 5,000 |
| `regions/r2.json` | 25,829 | 10,637 | about 10,000 |
| `regions/r3.json` | 100,405 | 37,795 | about 37,000 |
| `regions/r4.json` | 142,702 | 54,314 | about 54,000 |
| `regions/r5.json` | 284,916 | 107,256 | about 107,000 |
| The largest book file, `books/joshua.json` | 37,727 | 5,916 | |
| The smallest book file, `books/haggai.json` | 172 | 156 | |

With gzip, each region file is 0.2% to 6.4% larger than the number of the designer. The designer's numbers are approximate and have no margin and a different file format. The script adds the margin of 0.2 degrees. I did not measure the part of each cause.

All 67 files of `public/data/map/`: 822,263 bytes, 270,850 with gzip.

### The places of the kind "place" with a type that is not "settlement"

975 places have the kind "place". 683 of them have only the type "settlement". The other types, with the number of places and three examples, in the order of the output:

| Type | Places | Examples |
|---|---:|---|
| special | 140 | Addar, Addon, Ai 2 |
| region | 36 | Bethany 2, Beth-barah, Beth-rehob |
| valley | 36 | Ge-harashim, Giah, Jordan Valley |
| campsite | 32 | Abel-shittim, Abronah, Alush |
| island | 20 | Cauda, Chios, Cos |
| natural area | 14 | Dura, Geruth Chimham, Giah |
| river | 7 | Azal, Me-jarkon, Migron 1 |
| road | 6 | Adummim, Atharim, King’s Highway |
| tree | 5 | Allon-bacuth, Bochim, Diviners’ Oak |
| well | 5 | Beer-lahai-roi, Esek, Rehoboth 1 |
| body of water | 4 | Chinnereth, Sea of Jazer, Suph |
| spring | 4 | Eglaim, Eneglaim, Harod 2 |
| structure | 4 | Broad Wall, Gabbatha, Tower of Hananel |
| wadi | 4 | Bethany 2, Beth-barah, Cherith |
| field | 3 | Akeldama, Helkath-hazzurim, Washer’s Field |
| pool | 3 | Bethesda, Shiloah, Siloam |
| altar | 2 | Most Holy Place 2, Topheth |
| cliff | 2 | Bozez, Seneh |
| ford | 2 | Bethany 2, Beth-barah |
| garden | 2 | Eden 1, Gethsemane |
| mine | 2 | Ophir, Uphaz |
| promontory | 2 | Salmone, Trogyllium |
| rock | 2 | Ebenezer 2, Serpent’s Stone |
| stone heap | 2 | Ezel, Mizpah 4 |
| canal | 1 | Ahava |
| district in settlement | 1 | Dura |
| forest | 1 | Hereth |
| mountain pass | 1 | Akrabbim |
| room | 1 | Holy Place 2 |

A place can have more than one of these types, so the sum of the column is more than 292. The designer did not check these places. Rule 6 gives them the kind "place". Examples of a result that can look wrong:

- A place with a type of water and the type "settlement" is a "place", by the first rule of rule 6. The types "river", "body of water", "spring", and "wadi" in the table are of this kind.
- An island is a "place", because rule 6 has no rule for the type "island". Cauda, Chios, and Cos have a dot and a name in the style of a place.

I kept each result, by the warning of the task.

## More results of the rules

- 86 names are two or more times in the places of one book, counted one time in each book. The output lists them. Example: Exodus has three places with the name "Red Sea", of the kind "water". Two of them have the same position, 33.0 E, 28.75 N. Rule 1 of the priority rule of section 15.11 joins only the places with a dot or a triangle at one position. A water has no dot, so the second "Red Sea" at that point tries its other positions, above and below. I did not check whether the map of Exodus then shows "Red Sea" two times.
- The rule of the rivers leaves out six features of the class "River" by the name: Gharraf Canal, Suez Canal, Ismailiya Canal, Panama Canal, Hindiyah Channel, and Caledonian Canal. The rule reads only the field `name`.
- The positions of all places of the book files are from -10 to 70 degrees east and from 10 to 50 degrees north. The test of step 7 checks this.

## The form of the region files

A region file has `region`, `dataBox`, `unit`, `land`, `lakes`, and `rivers`. `unit` is 0.0001. A coordinate is an integer in units of 0.0001 degrees. A ring or a line is one flat array: the first point as longitude and latitude, then each next point as the difference from the point before it. A ring is closed, and the array does not repeat its first point. A polygon is a list of rings: the outer ring first, then the holes. A river is `scalerank` and a list of lines. The rounding error of a coordinate is 0.00005 degrees at most, less than the limit of 0.0001 degrees of the task. The script cuts the polygons with the method of Sutherland and Hodgman, and the lines with the method of Liang and Barsky. It does no simplification. Two points in a row that are the same after the rounding become one point.

## Not verified

- I did not draw a map from the files. Task 38 draws the map.
- I did not check that a ring cut by the script draws correctly when it crosses the edge of the data box two times or more.
- I did not confirm that the candidate rule, with Dragon Spring, Dura, Moreh 1, and The Lord Will Provide, is the rule of the designer.
- I did not measure the part of the margin and the part of the file format in the difference of the bytes.
