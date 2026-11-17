# Task 36: the map of the places of a book, a report on the data

Written on 2026-11-17 for Arthur. Arthur uses this report to decide the build tasks of the map of section 15 of `docs/DESIGN.md`. No page and no data file of the site changed.

Each count in steps 1 and 3 to 9 is from the output of `node scripts/map-report.mjs <folder> <svg folder>`, run on 2026-11-17, or is a sum, a difference, or a ratio of numbers in that output. The script prints each number and each record that this report takes from the data or from a render. The verse numbers of the examples of names in step 4 are from a read of the text of the site. The folder is the temporary folder `C:\Users\alang\AppData\Local\Temp\claude\7ba447bc64673977\e77fcb88-5f99-4afb-81a1-addbaca8412a\scratchpad\map`. It is not in the repository. The output is in that folder, in `report.txt`. The statements about the licences are from the pages of step 1. The statements about the meaning of the data are from the file `readme.md` of the places data, at the commit of step 1, and from the blog page of step 1. Where the readme and the data differ, this report says so.

The rule of the sketches, from section 15.4 of `docs/DESIGN.md`, is the rule of each count:

- A place of a book is a place of `ancient.jsonl` with a verse in that book.
- Its position is the position of its modern location with the highest score.
- A score below 500 gives the open dot.

Words of this report:

- "Place": an ancient place of `ancient.jsonl`. "Location": a modern location of `modern.jsonl`. The readme uses the same two words.
- "Position": one point of longitude and latitude. Longitude is east of Greenwich, latitude is north of the equator.
- "The places data": the Bible Geocoding Data of OpenBible.info. "Natural Earth": the map data of Natural Earth.

## Step 1. The sources and their licences

The full record is in section 12 of `docs/DATA-SOURCES.md`. Claude read the licence statements before the downloads. The pages ask for a credit for the places data. The OpenStreetMap parts of the places data have the ODbL, which the readme compares to CC-BY-SA. I did not read the ODbL.

| Source | Commit | Licence statement, read on 2026-11-17 | Credit words that the source asks for |
|---|---|---|---|
| Places data, `https://github.com/openbibleinfo/Bible-Geocoding-Data` | `7eb18a5`, the commit of the designer. It is also the newest commit of the branch `main`. | The readme: "This data is licensed under a Creative Commons Attribution 4.0 license." And: "OpenStreetMap data is licensed under ODbL 1.0, which is similar to CC-BY-SA." | `https://www.openbible.info/geo/` asks for a credit to OpenBible.info: "as long as you credit OpenBible.info". It gives no exact words. The licence text, section 3(a)(1), asks for these items. If the licensor supplies them: the name of the creator, a copyright notice, a notice that refers to the licence, a notice that refers to the disclaimer of warranties, and a link to the material where practical. Also: a statement if the material was changed, with any earlier changes, and the text of the licence or a link to it. Section 3(a)(2): "it may be reasonable" to satisfy these conditions with a link to a page that has the information. |
| Natural Earth, `https://github.com/nvkelso/natural-earth-vector` | `ca96624`, the commit of the designer. It is also the newest commit of the branch `master`. | `LICENSE.md` and the terms page: "All versions of Natural Earth raster + vector map data found on this website are in the public domain." | None. "Crediting the authors is unnecessary." For a person who wants to cite the data, the page gives "Made with Natural Earth." and a long text. |

The files that Claude read, with the size and the SHA-256 of each, are in the table "Downloads (Task 36 step 1)" of `docs/DATA-SOURCES.md`. The SHA-256 of `ancient.jsonl` and of `modern.jsonl` are the values of the designer.

### The parts of the places data with the OpenStreetMap licence

The readme names these parts as OpenStreetMap data:

- the geometry with the role `precise`, "geometry from OpenStreetMap", and the field `precise_geometry_id`;
- the geometry with the role `local`, the outline of the remains of a site from OpenStreetMap, and the field `local_geometry_id`;
- the secondary sources of type "osm" and "osm_group".

The data shows three more parts with the mark "osm". The readme does not name them:

- the field `geometry_credit` with the value "osm";
- the entries of `geometry.jsonl` with the format "osm";
- the locations whose `coordinates_source` has the type "osm". The readme says that a secondary source has "the same format as `coordinates_source`", and it names the type "osm" only for a secondary source. Each of the 51 locations with this type has a URL of an OpenStreetMap node.

The numbers:

| Part | Number |
|---|---:|
| Locations with `geometry_credit` "osm" | 344 of 1,596 |
| Places with `geometry_credit` "osm" | 549 of 1,342 |
| Locations with `precise_geometry_id` | 155 |
| Locations with `local_geometry_id` | 189 |
| Entries of `geometry.jsonl` with the format "osm" | 351 of 588 |
| Locations with a secondary source of type "osm" or "osm_group" | 745 |
| Locations whose coordinates come from OpenStreetMap, `coordinates_source` of type "osm" | 51 |

Does a map of the site need these parts? The sketches use the names, the verses, the scores, and one position for each place. The names, the verses, and the scores are not in the list above. The lines of the coast, the rivers, and the lakes of the sketches come from Natural Earth, not from the places data. The one exception is the position:

- The rule of the sketches gives a position to 1,278 places with verses.
- For 19 of these places, at 13 points, the coordinates of the location come from an OpenStreetMap node: Abronah, Ahlab, Alush, Azekah, Etam 1, Etham, Geder, Gedor 1, Gedor 3, Gedor 4, Gozan, Hara, Hazor 4, Helbah, Karka, Mahalab, Mount Nebo, Ulai, and Zarephath. Etham is a place of Exodus.

I do not know if the ODbL applies to one coordinate taken from a node of OpenStreetMap. I did not read the text of the ODbL 1.0, so this report does not give its credit words. Arthur decides.

Two more facts about the source of the positions:

- The readme says that `custom_lonlat` is "a nearby but independently created longitude, latitude pair" when the coordinates "are derived from a commercial source". 5 places of the rule, at 4 points, have a position with a `custom_lonlat`: Beth-dagon 1, En-gannim 1, Kattath, Kitron, and Zanoah 2. The rule of the sketches uses `lonlat`, not `custom_lonlat`.
- 7 places of the rule have a position whose `coordinates_source` has a type that starts with "google": 4 "google_maps", 2 "google_books", and 1 "google_earth_community". These are Hazor 2, Naarah, Naaran, Seneh, Shebarim, Tabbath, and Telem. The readme says nothing more about them.

The sources of the 1,278 positions, by the type of `coordinates_source`: wikidata 824, daahl 117, megajordan 77, wikipedia_article 60, iaa 48, geonames 36, palopenmaps 25, osm 19, representative_point_in_region 15, none 14, known_book 10, pleiades 8, google_maps 4, amudanan 3, davidrumsey 3, govmap 3, ane_kml 2, google_books 2, and 1 each of corona, google_earth_community, hadashot_arkheologiyot, raremaps, representative_point_along_path, topostext, webpage, and wikimedia_commons.

## Step 3. The places data

### What the data is

From the readme:

- An ancient place is a place that the Bible names, such as Jerusalem. A modern location is a place of today that scholars identify with an ancient place. The two can have the same name and not be at the same point.
- A place has one or more identifications. Each identification leads, through other places possibly, to one or more locations. The field `modern_associations` of a place lists each location with a score.
- The score of a location in `modern_associations` is the `time_total` of the identification, multiplied by the `best_time_score` of the resolution divided by 1000, if the resolution has one. I checked this on the data: for 3,852 of the 4,314 associations the score is the same as the formula. For the other 462, the difference is 1. All 462 have a negative value. The readme does not give the rounding rule, so I do not know the cause of the difference.
- An identification has six values `time_values`, one for each ten years of scholarship from "1969 and before" to "2010 and after". The readme: these values "are an integer best viewed as a fraction of 1000, where 1000 represents very high confidence", and "a score of 500 reflects a 50% confidence". It also has `time_best_fits`, the values of a best-fit line through `time_values`.
- The readme says that `time_total` "is the same as the last value in `time_values`". The data does not agree. Of the 2,842 identifications with the two arrays, `time_total` is the last value of `time_best_fits` only in 2,825, and the last value of both arrays in 17. In none is it the last value of `time_values` only. Example, Rameses: the last of `time_values` is 300, the last of `time_best_fits` is 509, and `time_total` is 509.
- The blog page of step 1 agrees with the data: the number of the confidence levels is the value of the best-fit line in 2020.
- So the score of the sketches is the value of a fitted line at the end of the last period, from the sources that the author of the data read. When the resolution has a `best_time_score`, this value is multiplied by it and divided by 1000. The readme says that this value, "in theory, reflects the confidence of current scholarship". The sentence "500 reflects a 50% confidence" is about `time_values`, not about the value of the line.
- The readme gives one condition for a value of 1000 in `time_values`: the sources of the period "unanimously had high confidence". It also says that `time_total` is 1000 when there is no major dispute about the identification.

The limits that the readme gives:

- For the vote total of an identification: "An overall total of 500 or higher represents high confidence in the identification."
- For `best_path_score`: "A score of 500 or higher indicates very high confidence."
- For the score of `modern_associations`, the score of the sketches: the readme gives no limit for "sure" and "not certain". It gives the meaning "500 reflects a 50% confidence" only for `time_values`. The score of the sketches is made from the line through these values.

The page of a place on `https://www.openbible.info/geo/` shows a percentage, not the score. Example: the page of Rameses shows "Qantir (modern): 55% confidence", and the score of Qantir in the data is 509. I do not know how the page makes 55% from the data.

The highest score of each of the 1,335 places with a location:

| Score | Places |
|---|---:|
| Below 0 | 2 |
| 0 to 99 | 35 |
| 100 to 199 | 109 |
| 200 to 299 | 133 |
| 300 to 399 | 150 |
| 400 to 499 | 156 |
| 500 to 599 | 104 |
| 600 to 699 | 95 |
| 700 to 799 | 102 |
| 800 to 899 | 68 |
| 900 to 999 | 23 |
| 1000 or more | 358 |

- 585 of the 1,335 places have a score below 500.
- The lowest score is -87. The highest is 1169. Six places have a score above 1000: Bozez 1011, Ham 2 1169, Hamath 2 1077, Immer 1007, Sibraim 1013, Zaphon 2 1041. A line value can be above 1000 or below 0 when the line rises or falls. Example, Ham 2: `time_values` goes from 0 to 1000, the line ends at 1169, and `time_total` is 1169.
- For 7 places, two or more locations have the same highest score, at different positions. The script takes the first in the order of the file.

### The numbers of places

- Ancient places: 1,342. With verses: 1,285. With a location: 1,335.
- Modern locations: 1,596.
- 1,095 places have one type. 247 have two to six types: 200 have two, 27 three, 11 four, 8 five, 1 six.

The places by type. A place with two types is in two rows. The type "special" is a place with a possible resolution that is not a location, for example "unknown place".

| Type | All places | With verses | All places with this type only |
|---|---:|---:|---:|
| settlement | 922 | 879 | 724 |
| region | 187 | 175 | 135 |
| special | 176 | 175 | 0 |
| mountain | 47 | 47 | 26 |
| river | 41 | 40 | 18 |
| valley | 38 | 38 | 27 |
| campsite | 32 | 32 | 27 |
| gate | 26 | 26 | 26 |
| island | 21 | 21 | 11 |
| hill | 20 | 20 | 13 |
| spring | 20 | 20 | 10 |
| body of water | 18 | 18 | 6 |
| natural area | 18 | 18 | 6 |
| structure | 13 | 12 | 12 |
| wadi | 10 | 10 | 1 |
| mountain range | 7 | 7 | 4 |
| pool | 7 | 7 | 6 |
| tree | 7 | 7 | 5 |
| road | 6 | 6 | 5 |
| altar | 5 | 5 | 3 |
| district in settlement | 5 | 5 | 3 |
| people group | 5 | 4 | 5 |
| well | 5 | 5 | 5 |
| field | 3 | 3 | 3 |
| garden | 3 | 3 | 2 |
| hall | 3 | 3 | 3 |
| cliff | 2 | 2 | 2 |
| ford | 2 | 2 | 0 |
| fortification | 2 | 2 | 0 |
| mine | 2 | 2 | 0 |
| mountain ridge | 2 | 2 | 0 |
| promontory | 2 | 2 | 2 |
| rock | 2 | 2 | 2 |
| room | 2 | 2 | 1 |
| stone heap | 2 | 2 | 1 |
| canal | 1 | 1 | 0 |
| forest | 1 | 1 | 0 |
| mountain pass | 1 | 1 | 1 |

### How a region, a river, and a sea have their position

Each location has one point, `lonlat`. The rule of the sketches uses this point for each place. For a region, a river, or a sea, the readme calls it a "representative point": "a point inside the region or along the path". The line or the area is in a separate geometry file.

The places with one type only and with verses:

| Type | Places | The location is a point | The location is a line | The location is an area | Has a geometry file |
|---|---:|---:|---:|---:|---:|
| region | 124 | 80 | 1 | 43 | 124 |
| river | 17 | 0 | 17 | 0 | 17 |
| body of water, a sea or a lake | 6 | 0 | 0 | 6 | 6 |
| mountain range | 4 | 2 | 0 | 2 | 4 |
| valley | 27 | 8 | 6 | 13 | 27 |

- For the regions, the point of the position is a "representative point" for 114 and a "center" for 10. A center is the middle of a circle in which the place can be.
- A region can have as its position the point of a city. Examples: the position of Egypt is the point of Ain Shams, 31.31 E, 30.13 N. The position of Judea is the point of Jerusalem. Step 8 gives the numbers.
- `geometry.jsonl` has 588 entries: polygon 232, rough boundary 141, path 121, isobands 77, probability 10, rough path 7. The isobands are areas from many printed maps, with a level of confidence. The sketches do not use these files.

## Step 4. The verses and the names

### The verse numbers

- The data names each verse in the form `Book.chapter.verse`, for example `Exod.1.11`. All 8,742 verse entries have this form. The script uses the field `sort` of each entry, which gives the number of the book from 1 to 66.
- The readme: the field `alternate_verses` "appears when the versification differs from the ESV". So the data uses the verse numbers of the ESV.
- Each of the 8,742 verse entries is a verse that exists in each of the three translations of the site. The script found 0 entries with no such verse in the BSB, in the KJV, or in the WEB.

The verse numbers of the three translations of the site differ in these places only:

- Romans 14: the WEB has verses 24 to 26. The BSB and the KJV end at verse 23.
- Romans 16: the WEB ends at verse 24. The BSB and the KJV have verse 27.
- 16 verses that the KJV has are not in the BSB, for example Matthew 17:21. The WEB does not have 7 verses that the KJV has: Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7, and Romans 16:25 to 16:27.
- No verse entry of the places data is in one of these verses. The script found 0.

Six verse entries have `alternate_verses`. Where the three translations of the site have the name:

| Verse of the data | Place | Other verse in the data | BSB | KJV | WEB |
|---|---|---|---|---|---|
| Luke 23:50 | Arimathea | 23:51 in 9 translations, the KJV one of them | 23:51 | 23:51, "Arimathæa" | 23:51, "Arimathaea" |
| Acts 24:18 | Asia | 24:19 in 5 translations | 24:18 | 24:18 | 24:18 |
| 1 Chronicles 11:5 | Jebus | 11:4 in the NIV | 11:5 | 11:5 | 11:5 |
| Acts 4:5 | Jerusalem | 4:6 in the KJV and the NKJV | 4:5 | 4:6 | 4:5 |
| Mark 3:7 | Judea 1 | 3:8 in the NIV and the NRSV | 3:7 | 3:7, "Judæa" | 3:7 |
| Genesis 37:14 | Shechem | 37:15 in the NET | 37:14 | 37:14 | 37:14 |

So the books where the verse of the data and the verse of a translation of the site differ, by `alternate_verses`, are Luke, for Arimathea in all three translations, and Acts, for Jerusalem in the KJV.

A second search found more differences of this kind. A row of the output is a verse entry where one translation of the site has no name of the place in that verse, a different translation of the site has a name in it, and the first translation has a name in the verse before or after. The script found 99 rows in 24 books: Genesis 1, Leviticus 1, Numbers 2, Deuteronomy 1, Joshua 9, Judges 10, 1 Samuel 3, 2 Samuel 5, 1 Kings 2, 2 Kings 3, 1 Chronicles 1, 2 Chronicles 3, Ezra 2, Nehemiah 2, Psalms 4, Isaiah 3, Jeremiah 9, Ezekiel 13, Daniel 3, Amos 2, Nahum 2, Luke 1, Acts 16, and Hebrews 1. A row is a sign of a different verse division, or of a pronoun or a different order of words in one translation. I read some rows. Example: in Acts 18:23 the BSB names Antioch, and the KJV and the WEB say "there" and name Antioch in 18:22. I did not read each of the 99 rows, so I do not know how many are a different verse division.

### The names

The data has a name for each place, `friendly_id`, for example "Rameses" or "Aroer 2". The number tells two places with one name apart. The field `translation_name_counts` gives each form of the name in the ten translations of the data and its count. The ten translations are the CSB, ESV, KJV, LEB, NASB, NET, NIV, NKJV, NLT, and NRSV. The BSB and the WEB are not among them.

How the script finds the name in a verse of the site: it searches the verse for each form of `translation_name_counts`, as a whole word. "ae" also matches "æ". If it finds no form, it searches again with no difference between capital and small letters. A name from the second search has a "*" in the output.

The example of the task, Rameses: the BSB has "Rameses" in Exodus 1:11 and 12:37. The KJV and the WEB have "Raamses" in 1:11 and "Rameses" in 12:37.

Exodus names 33 places. For 20, a translation of the site has a name that is not the name of the data, or a verse with no name of the data. The rows where the three translations differ from the name of the data:

| Place | Name of the data | BSB | KJV | WEB |
|---|---|---|---|---|
| Amalek | Amalek | Amalek, Amalekites | Amalek | Amalek |
| Baal-zephon | Baal-zephon | Baal-zephon | Baal-zephon | Baal Zephon |
| Euphrates | Euphrates | Euphrates | river | River |
| Great Sea | Great Sea | Sea of the Philistines | sea of the Philistines | sea of the Philistines |
| Holy Place 1 | Holy Place | Holy Place, and no name in 6 verses | holy place, and no name in 3 verses | holy place, and no name in 3 verses |
| Most Holy Place 1 | Most Holy Place | Most Holy Place, and no name in 40:3 | most holy, most holy place, and no name in 40:3 | most holy, most holy place, and no name in 40:3 |
| Mount Horeb | Mount Horeb | Horeb, Mount Horeb | Horeb | Horeb, Mount Horeb |
| Mount Sinai | Mount Sinai | Mount Sinai, Sinai | mount Sinai, Sinai | Mount Sinai, Sinai |
| Nile | Nile | Nile, in 15 verses | river, in 15 verses | river in 14 verses, Nile in 1 |
| Philistia | Philistia | Philistia | Palestina | Philistia |
| Pi-hahiroth | Pi-hahiroth | Pi-hahiroth | Pi-hahiroth | Pihahiroth |
| Rameses | Rameses | Rameses | Raamses, Rameses | Raamses, Rameses |
| Red Sea 1, 2, 3 | Red Sea | Red Sea | Red sea | Red Sea |
| Shur | Shur | Desert of Shur | Shur | Shur |
| Sin | Sin | Desert of Sin | Sin | Sin |
| Wilderness of Sinai | Wilderness of Sinai | Wilderness of Sinai | wilderness of Sinai, desert of Sinai | wilderness of Sinai |

- The WEB form "Pihahiroth" is not in `translation_name_counts`. I read it in the verses Exodus 14:2 and 14:9 of the output.
- Egypt has "Egypt" and "Egyptians" in all three. The BSB also has "Nile" in one verse and "Egyptian" in one verse of Egypt. In 3 verses of Egypt, 4:24, 4:29, and 11:8, no translation of the site has a name of the data. Marah, in 15:25 and 15:27, is the same.

Acts names 107 places. For 59, a translation of the site has a name that is not the name of the data, or a verse with no name. The rows where the names differ:

| Place | Name of the data | BSB | KJV | WEB |
|---|---|---|---|---|
| Adramyttium | Adramyttium | Adramyttian | Adramyttium | Adramyttium |
| Adriatic Sea | Adriatic Sea | Adriatic Sea | Adria | Adriatic Sea |
| Akeldama | Akeldama | Akeldama, Field of Blood | Aceldama, The field of blood | Akeldama, The field of blood |
| Antioch 2 | Antioch | Antioch | Antioch | Antioch, Antioch of Pisidia |
| Aphek 2 | Aphek | Antipatris | Antipatris | Antipatris |
| Areopagus | Areopagus | Areopagus | Areopagus, Mars’ hill | Areopagus |
| Ashdod | Ashdod | Azotus | Azotus | Azotus |
| Beautiful Gate | Beautiful Gate | gate called Beautiful, Beautiful Gate | Beautiful, Beautiful gate | Beautiful, Beautiful Gate |
| Berea | Berea | Berea | Berea | Beroea |
| Caesarea | Caesarea | Caesarea | Cæsarea | Caesarea |
| Canaan | Canaan | Canaan | Chanaan | Canaan |
| Cauda | Cauda | Cauda | Clauda | Clauda |
| Cenchreae | Cenchreae | Cenchrea | Cenchrea | Cenchreae |
| Chaldea | Chaldea | Chaldeans | Chaldæans | Chaldaeans |
| Cos | Cos | Cos | Coos | Cos |
| Fair Havens | Fair Havens | Fair Havens, and no name in 27:12 | The fair havens, and no name in 27:12 | Fair Havens, and no name in 27:12 |
| Forum of Appius | Forum of Appius | Forum of Appius | Appii forum | Market of Appius |
| Haran | Haran | Haran | Charran | Haran |
| Judea 1 | Judea | Judea | Judæa | Judea |
| Lod | Lod | Lydda | Lydda | Lydda |
| Malta | Malta | Malta | Melita | Malta |
| Midian | Midian | Midian | Madian | Midian |
| Mount of Olives | Mount of Olives | Mount of Olives | Olivet | Olivet |
| Mount Sinai | Mount Sinai | Mount Sinai | Sina | Mount Sinai |
| Phoenicia | Phoenicia | Phoenicia | Phenice, Phenicia | Phoenicia |
| Phoenix | Phoenix | Phoenix | Phenice | Phoenix |
| Red Sea 1 | Red Sea | Red Sea | Red sea | Red Sea |
| Samothrace | Samothrace | Samothrace | Samothracia | Samothrace |
| Sharon 1 | Sharon | Sharon | Saron | Sharon |
| Shechem | Shechem | Shechem | Sychem | Shechem |
| Solomon’s Portico | Solomon’s Portico | Solomon’s Colonnade | Solomon’s porch, porch that is called Solomon’s | Solomon’s porch, porch that is called Solomon’s |
| Straight Street | Straight Street | Straight Street | Straight | Straight |
| Syrtis | Syrtis | Syrtis | no name; the verse says "the quicksands" | Syrtis |
| Three Taverns | Three Taverns | Three Taverns | The three taverns | Three Taverns |
| Trogyllium | Trogyllium | no name in 20:15 | Trogyllium | Trogyllium |

- Also in Acts: names of people instead of a place, for example "Ethiopians" for Ethiopia, "Lycaonian" in the BSB for Lycaonia, "Pisidian" in the BSB, and "Alexandrians". The full rows are in the output.
- The KJV "Phenice" is the name of two places of the data: Phoenicia in two verses and Phoenix in one.
- The other rows of the 59 are in the output. In some, a translation has "there" or a pronoun in place of the name. Example: Antioch 1 in Acts 18:23. In some, the data has a place that no translation of the site names. Examples: Rome in Acts 19:40, and in 25:25, where the BSB has "the Emperor" and the KJV has "Augustus". I did not classify each row.

## Step 5. The 66 books

The rule of the sketches. "Places": the places with a verse in the book. "Position": the places with a location. "Below 500": the places with a position and a score below 500. "Box": the smallest box of longitude and latitude that holds the positions.

| Book | Places | Position | Below 500 | Box: longitude east | Box: latitude north |
|---|---:|---:|---:|---|---|
| Genesis | 117 | 116 | 41 | 24.89 to 48.26 | 14.21 to 40.38 |
| Exodus | 33 | 31 | 15 | 30.37 to 47.44 | 28.49 to 32.77 |
| Leviticus | 7 | 4 | 2 | 31.31 to 35.33 | 28.54 to 32.77 |
| Numbers | 139 | 138 | 71 | 31.31 to 47.44 | 28.03 to 36.70 |
| Deuteronomy | 86 | 86 | 38 | 24.89 to 47.44 | 28.54 to 36.86 |
| Joshua | 432 | 431 | 196 | 31.31 to 47.44 | 28.49 to 34.19 |
| Judges | 150 | 149 | 48 | 31.31 to 39.03 | 28.49 to 36.86 |
| Ruth | 3 | 3 | 0 | 35.21 to 35.70 | 31.18 to 31.70 |
| 1 Samuel | 104 | 104 | 34 | 31.31 to 46.00 | 23.00 to 33.94 |
| 2 Samuel | 99 | 99 | 30 | 31.31 to 47.44 | 16.94 to 35.14 |
| 1 Kings | 105 | 105 | 22 | -6.94 to 47.44 | 15.35 to 37.27 |
| 2 Kings | 105 | 105 | 21 | 31.31 to 47.44 | 16.94 to 39.70 |
| 1 Chronicles | 211 | 210 | 86 | 24.89 to 47.44 | 18.22 to 36.86 |
| 2 Chronicles | 121 | 121 | 17 | -6.94 to 48.52 | 15.35 to 37.27 |
| Ezra | 49 | 49 | 11 | 34.17 to 48.52 | 31.00 to 36.36 |
| Nehemiah | 101 | 101 | 26 | 31.31 to 48.26 | 28.54 to 36.36 |
| Esther | 7 | 7 | 0 | 33.75 to 67.43 | 16.94 to 34.81 |
| Job | 10 | 10 | 3 | 33.75 to 46.10 | 15.35 to 35.95 |
| Psalms | 60 | 60 | 15 | -6.94 to 47.44 | 15.35 to 39.66 |
| Proverbs | 1 | 1 | 0 | 31.31 | 30.13 |
| Ecclesiastes | 1 | 1 | 0 | 35.23 | 31.78 |
| Song of Solomon | 18 | 18 | 4 | 34.88 to 39.87 | 29.81 to 33.69 |
| Isaiah | 136 | 136 | 42 | -6.94 to 48.52 | 15.35 to 40.38 |
| Jeremiah | 137 | 137 | 31 | -6.94 to 48.52 | 15.35 to 44.94 |
| Lamentations | 8 | 8 | 2 | 31.31 to 43.15 | 30.13 to 36.36 |
| Ezekiel | 107 | 106 | 23 | -6.94 to 48.52 | 15.35 to 40.38 |
| Daniel | 23 | 23 | 2 | 23.73 to 48.52 | 18.22 to 37.97 |
| Hosea | 26 | 26 | 5 | 31.25 to 43.15 | 29.85 to 36.36 |
| Joel | 15 | 15 | 1 | 31.31 to 44.95 | 15.35 to 40.38 |
| Amos | 43 | 43 | 8 | 24.89 to 45.93 | 16.94 to 36.70 |
| Obadiah | 14 | 14 | 2 | 28.04 to 43.19 | 30.18 to 38.49 |
| Jonah | 3 | 3 | 1 | -6.94 to 43.15 | 32.05 to 37.27 |
| Micah | 28 | 28 | 6 | 31.31 to 47.44 | 30.13 to 36.36 |
| Nahum | 12 | 12 | 1 | 21.85 to 43.15 | 16.94 to 36.36 |
| Habakkuk | 6 | 6 | 2 | 33.97 to 46.10 | 28.49 to 33.54 |
| Zephaniah | 18 | 18 | 2 | 24.89 to 43.15 | 16.94 to 36.36 |
| Haggai | 1 | 1 | 0 | 31.31 | 30.13 |
| Zechariah | 39 | 39 | 5 | 23.73 to 47.44 | 30.13 to 37.97 |
| Malachi | 3 | 3 | 1 | 33.97 to 35.60 | 28.54 to 31.78 |
| Matthew | 38 | 38 | 6 | 21.85 to 44.42 | 15.35 to 36.36 |
| Mark | 27 | 27 | 6 | 21.85 to 35.89 | 31.21 to 33.56 |
| Luke | 34 | 34 | 6 | 21.85 to 44.21 | 15.35 to 36.36 |
| John | 29 | 29 | 7 | 35.02 to 35.63 | 31.70 to 32.91 |
| Acts | 107 | 107 | 4 | 12.49 to 46.10 | 16.94 to 41.89 |
| Romans | 12 | 12 | 2 | -4.35 to 35.45 | 31.21 to 43.54 |
| 1 Corinthians | 7 | 7 | 0 | 22.54 to 35.23 | 31.78 to 41.60 |
| 2 Corinthians | 8 | 8 | 0 | 22.54 to 36.31 | 31.78 to 41.60 |
| Galatians | 9 | 9 | 1 | 32.98 to 36.31 | 28.54 to 39.27 |
| Ephesians | 1 | 1 | 0 | 27.34 | 37.94 |
| Philippians | 3 | 3 | 0 | 22.54 to 24.28 | 40.64 to 41.60 |
| Colossians | 3 | 3 | 0 | 29.11 to 29.26 | 37.79 to 37.93 |
| 1 Thessalonians | 7 | 7 | 0 | 22.54 to 35.23 | 31.78 to 41.60 |
| 2 Thessalonians | 1 | 1 | 0 | 22.95 | 40.64 |
| 1 Timothy | 2 | 2 | 0 | 22.54 to 27.34 | 37.94 to 41.60 |
| 2 Timothy | 12 | 12 | 0 | 12.49 to 32.98 | 37.53 to 43.81 |
| Titus | 2 | 2 | 0 | 20.74 to 24.89 | 35.31 to 39.02 |
| Philemon | 0, no place | 0 | 0 | none | none |
| Hebrews | 10 | 10 | 2 | 12.49 to 35.44 | 28.54 to 41.89 |
| James | 0, no place | 0 | 0 | none | none |
| 1 Peter | 7 | 7 | 0 | 12.49 to 37.83 | 31.78 to 41.89 |
| 2 Peter | 2 | 2 | 2 | 35.45 | 31.21 |
| 1 John | 0, no place | 0 | 0 | none | none |
| 2 John | 0, no place | 0 | 0 | none | none |
| 3 John | 0, no place | 0 | 0 | none | none |
| Jude | 3 | 3 | 2 | 31.31 to 35.45 | 30.13 to 31.21 |
| Revelation | 19 | 19 | 3 | 12.49 to 47.44 | 30.13 to 41.89 |

The numbers of the designer, compared:

| Number | Designer | This report |
|---|---:|---:|
| Places in the data | 1,342 | 1,342 |
| Places with verses | 1,285 | 1,285 |
| Exodus: places, with a position, below 500 | 33, 31, 15 | 33, 31, 15 |
| Acts: places, with a position, below 500 | 107, 107, 4 | 107, 107, 4 |
| Joshua: places | 432 | 432 |
| Books with no place | Philemon, James, 1 John, 2 John, 3 John | the same five |

All numbers agree. The OpenBible page `https://www.openbible.info/geo/` also shows "(No places)" for the same five books.

The places with no position: Nod, Azazel, Holy Place 1, Most Holy Place 1, Biziothiah, Nohah, and Bamah. The two places of Exodus with no position are Holy Place 1 and Most Holy Place 1. The data gives them the special resolution "multiple_locations": the readme gives the example "the tabernacle during the exodus".

## Step 6. A proposal for a set of regions

This step is a proposal. The boxes are mine: I rounded the boxes of step 5. The rule that gives each book its region is in the script, so the outside places are counts, not my selection.

The six regions:

| Region | Name | Longitude east | Latitude north | Size at 960 px wide | Reason for the box |
|---|---|---|---|---|---|
| R1 | The land of Israel | 34.0 to 36.7 | 29.4 to 33.7 | 960 by 1,794 px | Holds all places of John and Ruth, and all places of Mark but Cyrene; wide enough for Damascus, 36.31 E |
| R2 | Egypt, Sinai, and Canaan | 29.5 to 37.0 | 27.5 to 34.2 | 960 by 999 px | The box of Exodus with no Euphrates, made larger to 37.0 E and 34.2 N for Numbers and Deuteronomy |
| R3 | The Aegean: Greece and Asia | 20.5 to 31.5 | 35.0 to 42.0 | 960 by 781 px | The boxes of the six books that the rule gives to R3: Ephesians, Philippians, Colossians, 2 Thessalonians, 1 Timothy, and Titus |
| R4 | The Near East: Egypt to Persia | 29.0 to 49.0 | 27.5 to 38.5 | 960 by 630 px | From Egypt to Susa, 48.26 E, and from Mount Sinai to Haran and Nineveh |
| R5 | The Mediterranean: Rome to Jerusalem | 12.0 to 38.0 | 30.0 to 44.0 | 960 by 647 px | The box of Acts with no places east of 38 E or south of 30 N, made larger to 44 N for Dalmatia of 2 Timothy, 43.81 N |
| R6 | The whole world of the Bible | -10.0 to 70.0 | 12.0 to 46.0 | 960 by 466 px | From Tarshish, -6.94 E, to India, 67.43 E |

The rule: each book opens the smallest region, by area, that holds at least 90% of its places with a position.

| Region | Books |
|---|---|
| R1 | 11: Joshua, Judges, Ruth, 1 Samuel, 1 Chronicles, Ecclesiastes, Song of Solomon, Mark, Luke, John, 2 Peter |
| R2 | 13: Exodus, Leviticus, Numbers, Deuteronomy, 2 Samuel, 1 Kings, Nehemiah, Proverbs, Hosea, Haggai, Malachi, Hebrews, Jude |
| R3 | 6: Ephesians, Philippians, Colossians, 2 Thessalonians, 1 Timothy, Titus |
| R4 | 14: Genesis, 2 Kings, 2 Chronicles, Ezra, Psalms, Jeremiah, Lamentations, Daniel, Amos, Obadiah, Micah, Habakkuk, Zechariah, Matthew |
| R5 | 8: Acts, Romans, 1 Corinthians, 2 Corinthians, 1 Thessalonians, 2 Timothy, 1 Peter, Revelation |
| R6 | 9: Esther, Job, Isaiah, Ezekiel, Joel, Jonah, Nahum, Zephaniah, Galatians |
| None | 5: Philemon, James, 1 John, 2 John, 3 John |

The places outside the region of the book. The other books have no place outside.

| Book | Region | Outside, of the places with a position | The outside places |
|---|---|---|---|
| Genesis | R4 | 6 of 116 | Ararat, Caphtor, Eden 1, Havilah 2, Pishon, Sephar |
| Exodus | R2 | 1 of 31 | Euphrates |
| Numbers | R2 | 9 of 138 | Amaw, Asshur, Hazar-enan, Kittim, Pethor, River 2, Shepham, Zedad, Ziphron |
| Deuteronomy | R2 | 4 of 86 | Caphtor, Euphrates, Mesopotamia, Pethor |
| Joshua | R1 | 12 of 431 | Aphek 4, Brook of Egypt, Egypt, Euphrates, Gebal 1, Lebo-hamath, Midian, Red Sea 1, Salecah, Shihor 1, Shinar, Valley of Lebanon |
| Judges | R1 | 9 of 149 | Beth-rehob, Egypt, Karkor, Lebo-hamath, Mesopotamia, Midian, Mount Lebanon, Mount Sinai, Red Sea 2 |
| 1 Samuel | R1 | 4 of 104 | Egypt, Havilah 3, Shur, Zobah |
| 2 Samuel | R2 | 5 of 99 | Ethiopia, Euphrates, Hamath 1, Kadesh 2, Tibhath |
| 1 Kings | R2 | 7 of 105 | Arabia 1, Euphrates, Kue, Ophir, Sheba 1, Tarshish 2, Tiphsah 1 |
| 2 Kings | R4 | 2 of 105 | Ararat, Cush 1 |
| 1 Chronicles | R1 | 21 of 210 | Assyria, Babylon 1, Caphtor, Cun, Egypt, Euphrates, Gozan, Habor, Halah, Hamath 1, Hamath-zobah, Hara, Lebo-hamath, Mesopotamia, Midian, Ophir, Salecah, Shepham, Shihor 1, Tibhath, Zobah |
| 2 Chronicles | R4 | 5 of 121 | Arabia 1, Ophir, Parvaim, Sheba 1, Tarshish 1 |
| Nehemiah | R2 | 10 of 101 | Addon, Assyria, Babylon 1, Chaldea, Cherub, Immer, Susa, Tel-harsha, Tel-melah, Ur 1 |
| Psalms | R4 | 6 of 60 | Cush 1, Meshech, Ophir, Sheba 1, Tarshish 1, Tarshish 2 |
| Song of Solomon | R1 | 1 of 18 | Kedar |
| Jeremiah | R4 | 13 of 137 | Arabia 1, Ararat, Ashkenaz, Caphtor, Cush 1, Dedan, Lud 2, Pathros, Put, Sheba 1, Tarshish 1, Thebes, Uphaz |
| Daniel | R4 | 2 of 23 | Greece, Uphaz |
| Hosea | R2 | 1 of 26 | Assyria |
| Amos | R4 | 2 of 43 | Caphtor, Ethiopia |
| Obadiah | R4 | 1 of 14 | Sepharad |
| Zechariah | R4 | 1 of 39 | Greece |
| Matthew | R4 | 2 of 38 | Cyrene, South 2 |
| Mark | R1 | 1 of 27 | Cyrene |
| Luke | R1 | 3 of 34 | Cyrene, Nineveh, South 2 |
| Acts | R5 | 8 of 107 | Babylon 1, Chaldea, Ethiopia, Haran, Mesopotamia, Midian, Mount Sinai, Red Sea 1 |
| Romans | R5 | 1 of 12 | Spain |
| Hebrews | R2 | 1 of 10 | Italy |
| Revelation | R5 | 1 of 19 | Euphrates |

The books that do not fit a region well, and why:

1. The 9 books of R6: Esther, Job, Isaiah, Ezekiel, Joel, Jonah, Nahum, Zephaniah, and Galatians. No smaller region holds 90% of their places. R6 is 80 degrees wide, so at 960 px one degree of latitude is about 14 px. The box of R1 is then about 32 px wide. I expect the places of Judah to be on top of each other. I did not draw it.
2. Galatians: its 9 places go from Mount Sinai, 28.54 N, to Galatia, 39.27 N, and to Arabia. Its box fills 4% of the width of R6.
3. 1 Chronicles, Nehemiah, Psalms, and Hebrews are at the limit of 90%: 1 Chronicles 21 of 210 outside, Nehemiah 10 of 101.
4. The books with one place: Proverbs and Haggai, Egypt; Ecclesiastes, Jerusalem; Ephesians, Ephesus; 2 Thessalonians, Thessalonica. A map of a region for one dot.
5. Books that fill a small part of their region: Ruth fills 18% of the width and 12% of the height of R1, John 23% and 28%, Colossians 1% and 2% of R3, Philippians 16% and 14% of R3.
6. Revelation: 11 of its 19 places with a position are in R3. The 8 outside R3 are Armageddon, Babylon 3, East, Egypt, Euphrates, Jerusalem, Mount Zion, and Sodom. Babylon 3 has its position at Rome, with a score of 934. The Euphrates, 47.44 E, is also outside R5, so R5 holds 18 of 19.
7. Joshua: 431 places in R1. At 960 by 1,794 px, R1 has about 417 px for one degree of latitude. Section 15.6 item 3 is open.

## Step 7. The places in a city or in a building

The data has a rule for a place inside a settlement. The readme: a `lonlat_type` "settlement" means "the place is somewhere inside the settlement located at `lonlat`", and the `modifier` "<" with `in` "settlement" means that the place is inside a settlement. By this rule, 50 places with verses are in a settlement:

| Type | Places | Examples |
|---|---:|---|
| gate | 26 | Beautiful Gate, Sheep Gate, Water Gate, all 26 in Jerusalem but one: Bath-rabbim in Tell Hesban |
| structure | 8 | Solomon’s Portico, House of the Forest of Lebanon, Tower of the Ovens; Tower of Shechem and Beth-millo in Tell Balatah |
| district in settlement | 4 | East Square, Mortar, Second Quarter in Jerusalem; Rehoboth-Ir in Nineveh |
| settlement | 4 | Baal-hamon, Millo, Silla in Jerusalem; Rehoboth-Ir in Nineveh |
| hall | 3 | Hall of Judgment, Hall of Pillars, Hall of the Throne |
| pool | 3 | Lower Pool, Old Pool, Upper Pool |
| fortification | 2 | Millo, Silla |
| altar | 1 | El-bethel in Beitin |
| garden | 1 | Uzza |
| hill | 1 | Gareb |
| special | 1 | Baal-hamon |
| tree | 1 | Allon in Hanot Taggarim |

- A place with two types is in two rows, so the rows add to more than 50.
- 44 of the 50 are in Jerusalem.
- Exodus has none of the 50. Acts has 2: Beautiful Gate and Solomon’s Portico.

The types that the sketches leave out, with all their places with verses:

| Type | Places | With no other type than this one and "special" |
|---|---:|---|
| room | 2 | Holy Place 1, Holy Place 2 |
| gate | 26 | the 26 gates above |
| structure | 12 | 11: Angle, Beth-millo, Broad Wall, Gabbatha, House of the Forest of Lebanon, Parbar, Solomon’s Portico, Tower of Hananel, Tower of Shechem, Tower of the Hundred, Tower of the Ovens |
| field | 3 | Akeldama, Helkath-hazzurim, Washer’s Field |
| hill | 20 | 13: Ammah, Areopagus, Gareb, Gibeath-haaraloth, Goah, Golgotha, Gur, Moreh 2, Mount Moriah, Mount of Olives, Mount Zion, Ophel, Ramah 8 |
| hall | 3 | Hall of Judgment, Hall of Pillars, Hall of the Throne |
| pool | 7 | 6: Bethesda, Lower Pool, Old Pool, Shiloah, Siloam, Upper Pool |
| district in settlement | 5 | 3: East Square, Mortar, Second Quarter |

- The type "hill" holds the Mount of Olives and the Areopagus. Both are places of Acts with a score of 1000 and a position of their own. The rule of the data in the first table does not put them in a settlement.
- Akeldama, a field of Acts, has a position of its own with a score of 456.

## Step 8. The places at the same position

- The places with verses and a position have 779 different positions.
- 233 positions have two or more places. 732 places have the same position as a different place.
- 54 positions have a region and a settlement together.

The positions with the most places. 8 positions have 7 places or more. 5 positions have 6 places, so they share the ninth and the tenth place of the list:

| Position, east and north | Location | Places | Examples |
|---|---|---:|---|
| 35.234, 31.777 | Jerusalem | 57 | Jerusalem, Zion, Salem, Jebus, Judea 1, Judea 2, 25 gates, Beyond the River |
| 44.422, 32.543 | Babylon | 13 | Babylon 1, Babylonia, Babel, Shinar, Cush 2, Havilah 1 |
| 35.208, 31.704 | Bethlehem | 10 | Bethlehem 1, Ephrathah, Ephrath, Jabez |
| 35.241, 31.923 | Beitin | 10 | Bethel 1, Luz 1, Mount Ephraim, El-bethel |
| 35.850, 33.400 | Mount Hermon | 10 | Mount Hermon, Senir, Ituraea, Valley of Mizpeh |
| 34.841, 31.245 | Tel Beer Sheva | 9 | Beersheba 1, Negeb, South 1 |
| 35.232, 31.854 | Al Ram | 7 | Ramah 1, Ramah 4, Zuph |
| 35.701, 31.181 | Kerak | 7 | Moab 1, Kir-hareseth |
| 28.040, 38.488 | Sardis | 6 | Sardis, Lud 1, Lud 2, Gog, Magog, Sepharad |
| 35.102, 31.525 | Tel Rumeida | 6 | Hebron, Idumea, Valley of Eshcol |
| 35.236, 31.767 | Bir Ayub | 6 | En-rogel, King’s Valley, Washer’s Field |
| 35.261, 31.917 | Et Tell | 6 | Ai 1, Ai 3, Aiath, Avvim |
| 35.934, 31.955 | Amman | 6 | Rabbah 1, Ammon, East, King’s Highway |

- The example of the task: Judea 1 and Judea 2 have the location Jerusalem, with a score of 1000, so their point is the point of Jerusalem.
- More regions at the point of a city: Moab 1 at Kerak, Negeb at Tel Beer Sheva, Pisidia at Antioch in Pisidia, Syria 1 and Syria 2 at Damascus, Mesopotamia at Harran, Philistia at Tel Ashkelon.
- In Acts, Greece has the point of Athens, Libya the point of Cyrene, and Italy the point of Rome.

## Step 9. Natural Earth for the regions

### The size of a map

The script cuts the land, the lakes, and the rivers to the box of each region. It draws them as SVG path data at 960 px wide. The projection: x is the longitude times the cosine of the middle latitude, and y is the latitude. The coordinates have one decimal place.

- Land: `ne_10m_land` and `ne_10m_minor_islands`.
- Lakes: `ne_10m_lakes`, with no reservoir.
- Rivers: the features "River" of `ne_10m_rivers_lake_centerlines`, with no canal. No "Lake Centerline". I did not check where these lines are.
- The simplification: the method of Douglas and Peucker with a tolerance of 0.5 px, and no ring with an area below 0.25 square px.

| Region | Bytes | Bytes with gzip | Bytes after the simplification | With gzip after the simplification |
|---|---:|---:|---:|---:|
| R1 | 4,322 | 1,843 | 3,389 | 1,495 |
| R2 | 28,526 | 10,627 | 15,042 | 5,907 |
| R3 | 111,401 | 37,993 | 50,065 | 18,924 |
| R4 | 87,374 | 30,524 | 25,764 | 10,309 |
| R5 | 201,183 | 63,705 | 50,836 | 19,443 |
| R6 | 707,100 | 176,318 | 56,265 | 22,831 |
| Sum | 1,139,906 | 321,010 | 201,361 | 78,909 |

- GitHub Pages sends the files with gzip, so the column "with gzip" is the number of bytes that a reader downloads. I did not check this on the site.
- The land is the largest layer in R2, R3, R5, and R6. The rivers are the largest layer in R1 and R4. Example: in R5 the land after the simplification is 40,856 bytes of the 50,836.
- The output gives each layer of each region, with the number of features and points.

Is the simplification visible? I drew each map two times in Chromium at 960 px, with and without the simplification, and compared the pixels:

| Region | Pixels | Pixels that differ by more than 32 of 255 | Pixels that differ by more than 64 of 255 |
|---|---:|---:|---:|
| R1 | 1,722,240 | 103, 0.006% | 0 |
| R2 | 959,040 | 464, 0.048% | 7 |
| R3 | 749,760 | 1,689, 0.225% | 208 |
| R4 | 604,800 | 739, 0.122% | 12 |
| R5 | 621,120 | 1,413, 0.227% | 66 |
| R6 | 447,360 | 1,790, 0.400% | 318 |

I looked at R3 and R6 with and without the simplification. In R3 I saw no difference. In R6 I saw one: without the simplification, many small islands in the Persian Gulf make a dark mark; with the simplification, the mark is not there. The maps of this check have a line of 0.6 px and the colors of the sketches approximately. They are not the sketches. I did not check R1, R2, R4, or R5 by eye.

### Canals and reservoirs

Natural Earth has no class "canal". The script takes as a canal each river line with the word "canal" or "channel" in its name, and as a reservoir each lake with the class "Reservoir".

| Region | Canals | Reservoirs |
|---|---|---|
| R1 | none | none |
| R2 | Suez Canal, Ismailiya Canal | none |
| R3 | none | none |
| R4 | Gharraf Canal, Suez Canal, Ismailiya Canal, Hindiyah Channel | Lake Habbaniyah, Buhayrat ath Tharthar, Karakaya Dam Lake, Atatürk Dam, Buhayrat al-Assad |
| R5 | Suez Canal, Ismailiya Canal | none |
| R6 | the 4 canals of R4 | 16: the 5 of R4, and Khashm el Girba Dam, Mingachevir, Lake Nasser, Chardara Reservoir, Keban Dam, Kayrakkum, and 5 with a name that starts with "Embalse" |

- The note of Natural Earth on Buhayrat ath Tharthar is "Largest lake in Iraq". Natural Earth gives it the class "Reservoir".
- The other river lines of R4 have these names in Natural Earth: Al Furat, Atshan, Byk Menderes, Ceyhan, Damietta Branch, Dicle, Euphrates, Firat, Jordan, Karkheh, Nile, Qezel Owzan, Rosetta Branch, Shatt al Arab, Shatt al Hillah, Talkeh, Tigris, and lines with no name. The rule of the script takes all of them as rivers. I did not check whether one of them is a canal.

### Differences between the water of today and the water of the ancient world

I report only what a source states.

1. The Dead Sea. Natural Earth has two lakes with the name "Dead Sea" and the class "Alkaline Lake": one from 31.30 to 31.77 N, and one from 31.09 to 31.25 N. The two boxes have 0.05 degrees of latitude between them. The places data has the outline `g2e7540`, "Salt Sea", with the source "ancient" and the geometry "rough_boundary" in `geometry.jsonl`. Its file has one polygon, from 31.06 to 31.77 N. The readme defines the geometry "rough_boundary" as "an approximate boundary for the region". The same outline is the geometry of the location "Dead Sea", `m7d469b`, and that location is the position of the Salt Sea, with a score of 1000. So the places data uses one rough outline for the ancient sea and for the sea of today. No source of this task states a difference between the two.
2. Lake Huleh. The places data has the location "Lake Huleh", 35.60 E, 33.08 N, with the type "body of water" and the precision "point in former body of water". It has an outline from OpenStreetMap and a rough outline of the data, 33.04 to 33.09 N. Natural Earth has no lake at this point: in R2, its only lakes are the Sea of Galilee, the two parts of the Dead Sea, and the Great Bitter Lake. The places data links the Waters of Merom to Lake Huleh with a score of -101, so Lake Huleh is not the position of the Waters of Merom. The position of the Waters of Merom is En Meron, with a score of 77.
3. The marsh west of the Bitter Lakes. The places data has a location of the type "marsh" with this name, and the claim: "Grollenberg, Atlas of the Bible (1957) (page 44) places the "region of marshes" in this area". The four Natural Earth files of this report have no marsh: the values of `featurecla` in the four files are "Land", "Minor island", "Null island", an empty value, "Lake", "Reservoir", "Alkaline Lake", "River", and "Lake Centerline". The places data links Pi-hahiroth to this location with a score of -63. The position of Pi-hahiroth is "plain near Jabal Jinayfah", with a score of 103.

The script searches the comments and the claims of the places data for the words coast, shoreline, silt, drained, dried, evaporated, receded, marsh, lagoon, and "no longer". It prints 16 matches. I read them. Four are about a marsh: the claim of item 3; a claim for the location "between Maghfar and Lake Timsah", which quotes "a marsh between" for Pi-hahiroth; and two claims for Et Taba, a "marshy winter lake" and a "salt-marsh area", for Jotbathah. Of the other 12, 10 have "coast" in the name of a book or in the position of a place, one is a plateau that "drains", and one is an identification that is "no longer in favor". One of the 10, for Ptolemais, says that "much of the city had moved closer to the coast". None states that a coast, a delta, or a lake of the ancient world differs from today. Item 2 is not from this search: it is from the precision of the location Lake Huleh.

## Step 10. Proposals for Arthur

1. **The limit for "not certain".** Proposal: keep 500.
   - Reason: the readme says that a value of 500 in `time_values` "reflects a 50% confidence". The score of the sketches is the value of a line through these values, multiplied by the `best_time_score` of the resolution divided by 1000 when the resolution has one. The readme uses 500 as a limit for two other scores: "high confidence" for the vote total and "very high confidence" for `best_path_score`. The readme gives no limit for the score of the sketches.
   - Effect: 585 of the 1,335 places with a location have an open dot. Exodus 15 of 31, Acts 4 of 107, Joshua 196 of 431.
   - Cost: none. It is one number.
2. **The set of regions.** Proposal: the six regions of step 6, by the rule of 90%.
   - Reason: 52 of the 61 books with a place have a region smaller than R6, and the outside places of each are listed below the map, as in the sketches.
   - Cost: the six maps are 78,909 bytes with gzip after the simplification, or 321,010 bytes with no simplification. A build script must cut and simplify Natural Earth for each region.
   - Open: R6 is too wide for the land of Israel. A different choice is to give the 9 books of R6 the region R4 and list more places outside. Example: Isaiah would have places outside R4.
3. **The types of place that the map leaves out.** Proposal: leave out the 50 places that the data puts inside a settlement, by the rule of step 7, in place of a list of types.
   - Reason: the rule is that of the data, so no person selects a place. A list of types would also leave out the Mount of Olives, the Areopagus, and Golgotha, which are of the type "hill" and have a position of their own.
   - Cost: the map needs the field `lonlat_type` and the `modifier` of the data, not only the type.
   - Open: Holy Place 1 has no position, so the map does not show it by either rule. Holy Place 2 has the position of Mount Moriah and is not in a settlement by the rule of step 7. So the rule of step 7 shows it, and a list of types that leaves out rooms does not.
4. **The name on the map when the translations differ.** Proposal: show the name that the selected translation has in the verses of the book.
   - Reason: the rule of the site is that a translation changes only the words. A name on the map is a word of the translation. Example: Exodus, Rameses in the BSB and Raamses in the KJV and the WEB.
   - Cost: the build must search each verse of each translation for the name, as the script of step 4 does. In some verses a translation has no name: the KJV has "the river" for the Nile in 15 verses of Exodus, and "the quicksands" for Syrtis. These need a rule, for example the name of the data in such a case. The search of step 4 does not find a form that is not in the data, such as "Pihahiroth" of the WEB, so the build needs a list of these forms.
   - A simpler choice: the name of the data with no number, the same in each translation. Cost: the map and the text then differ in some names. Example: the map would show "Lod", and all three translations have "Lydda" in Acts.
5. **A book with no place.** Proposal: no line "Where" in "About this book" for Philemon, James, 1 John, 2 John, and 3 John.
   - Reason: section 15.2 says that the map shows the places that the book names, and not where the author wrote. These five books name no place in the data.
   - Cost: none. The OpenBible page shows "(No places)" for the same five books.

There is one more decision for Arthur, from step 1: the positions of 19 places, at 13 points, come from an OpenStreetMap node. The readme says that OpenStreetMap data has the ODbL licence.

## Not verified

- I did not read the text of the ODbL 1.0. This report gives no credit words for it, and I do not know if it applies to one coordinate.
- I did not check how the OpenBible page makes the percentage "55% confidence" from the data.
- I did not read each of the 99 rows of the second verse search of step 4.
- I did not search the names of the books other than Exodus and Acts. I do not know how many forms of names in the three translations are not in the data.
- I did not check by eye the maps of R1, R2, R4, and R5. The maps of the check are not the design of the sketches.
- I did not check whether a river line of R4, such as "Shatt al Hillah", is a canal.
- I did not check that GitHub Pages sends a map file with gzip.
- I did not draw R6 with the places of Judah, so I did not see whether they are on top of each other.
- I did not check where the lines "Lake Centerline" of Natural Earth are.
- I do not know the rounding rule of the data, so I do not know why 462 scores differ by 1 from the formula of the readme.
- I did not classify each of the 59 rows of Acts.
