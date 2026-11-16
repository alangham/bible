# Task 25: the marks of the words of Jesus, a report on the source files

Written on 2026-11-16 for Arthur. Arthur uses this report to decide if the site gets red letters, and how. No page and no data file of the site changed.

Each number and each list in steps 3 to 9 is from the output of `node scripts/wj-report.mjs`, run on 2026-11-16. The script only reads files of the repository:

- The Berean Standard Bible: `sources/bsb/usfm/`, and the site data in `public/data/text/`.
- The King James Version: `sources/kjv/usfm/`, and the site data in `public/data/text-kjv/`.
- The book list: `public/data/books.json`.

In this report, "the Berean files" are the files in `sources/bsb/usfm/`, and "the King James Version files" are the files in `sources/kjv/usfm/`. The words of a verse in steps 4 and 5 are the plain words of the USFM files, not the words of the site. For the Berean Standard Bible, the site takes its words from `sources/bsb/bsb.txt`, so the words of the site can differ from the words in steps 4 and 5. Step 6 gives each difference that touches a mark.

The designer's counts of 2026-11-16 are the start markers and the end markers together: 2,840 in the Berean files and 4,076 in the King James Version files. Step 3 gives the same totals.

## Step 3. The marks of each source set

A mark is one start marker `\wj` and the end marker `\wj*` after it. The numbers count markers and marks in the 66 books.

### Berean files

| Book | Start markers | End markers | Verses with marked words |
|---|---:|---:|---:|
| Matthew | 440 | 440 | 644 |
| Mark | 227 | 227 | 285 |
| Luke | 408 | 408 | 585 |
| John | 259 | 259 | 431 |
| Acts | 27 | 27 | 31 |
| 1 Corinthians | 2 | 2 | 2 |
| 2 Corinthians | 1 | 1 | 1 |
| Hebrews | 8 | 8 | 5 |
| Revelation | 48 | 48 | 63 |
| All | 1,420 | 1,420 | 2,047 |

Start markers and end markers together: 2,840. The other books have no marker.

Places where a start marker has no end marker, or an end marker has no start marker:

- None.

- Marks: 1,420.
- Marks that start before a marker `\v`: 163.
- Marks that have words of more than one verse: 532.
- Marks that have a paragraph marker or a poetry marker inside them: 0. By marker, each mark counted once for each marker that it has: none.
- Marks that have no letter inside them: 0.
- Marks whose first character is an opening quotation mark: 847. “ 777, ‘ 70.
- Marks whose last character is a closing quotation mark: 889. ” 766, ’ 123.
- The first character of the other marks: "T" 89, "B" 75, "A" 60, "W" 55, "I" 53, "S" 35, "H" 29, "a" 22, "Y" 19, "N" 18, "f" 16, "F" 16, "O" 14, "D" 13, "t" 10, "b" 6, "u" 6, "h" 5, "G" 4, "E" 4, "w" 4, "L" 4, "R" 3, "o" 3, "C" 3, "M" 2, "P" 2, "J" 2, "y" 1.
- The last character of the other marks: "." 385, "," 54, ":" 30, "?" 13, "!" 12, ";" 11, "]" 9, "s" 7, "d" 6, "n" 2, "e" 2.
- The markers inside the marks, with the number of times that each occurs. An end marker is not counted: `\v` 1,045, `\f (footnote)` 282.

### King James Version files

| Book | Start markers | End markers | Verses with marked words |
|---|---:|---:|---:|
| Matthew | 646 | 646 | 644 |
| Mark | 286 | 286 | 286 |
| Luke | 590 | 590 | 587 |
| John | 422 | 422 | 419 |
| Acts | 28 | 28 | 27 |
| 1 Corinthians | 2 | 2 | 2 |
| 2 Corinthians | 1 | 1 | 1 |
| Revelation | 63 | 63 | 62 |
| All | 2,038 | 2,038 | 2,028 |

Start markers and end markers together: 4,076. The other books have no marker.

Places where a start marker has no end marker, or an end marker has no start marker:

- None.

- Marks: 2,038.
- Marks that start before a marker `\v`: 0.
- Marks that have words of more than one verse: 0.
- Marks that have a paragraph marker or a poetry marker inside them: 0. By marker, each mark counted once for each marker that it has: none.
- Marks that have no letter inside them: 0.
- The markers inside the marks, with the number of times that each occurs. An end marker is not counted: `\+w` 28,589, `\+add` 623, `¶ (paragraph sign)` 68, `\+nd` 3.

## Step 4. The class of each verse

"all": each letter and each digit of the verse is in a mark. "part": some are in a mark. "none": none is in a mark. Punctuation does not count.

### Berean files

| Book | all | part | none |
|---|---:|---:|---:|
| Matthew | 500 | 144 | 424 |
| Mark | 152 | 133 | 388 |
| Luke | 414 | 171 | 564 |
| John | 269 | 162 | 447 |
| Acts | 9 | 22 | 972 |
| 1 Corinthians | 0 | 2 | 435 |
| 2 Corinthians | 0 | 1 | 256 |
| Hebrews | 2 | 3 | 298 |
| Revelation | 59 | 4 | 341 |
| The other books | 0 | 0 | 24,914 |
| All | 1,405 | 642 | 29,039 |

### King James Version files

| Book | all | part | none |
|---|---:|---:|---:|
| Matthew | 501 | 143 | 427 |
| Mark | 156 | 130 | 392 |
| Luke | 410 | 177 | 564 |
| John | 269 | 150 | 460 |
| Acts | 8 | 19 | 980 |
| 1 Corinthians | 0 | 2 | 435 |
| 2 Corinthians | 0 | 1 | 256 |
| Revelation | 58 | 4 | 342 |
| The other books | 0 | 0 | 25,218 |
| All | 1,402 | 626 | 29,074 |

### Berean class by King James Version class

The verses that the two sets have: 31,086.

| Berean \ King James Version | all | part | none |
|---|---:|---:|---:|
| all | 1,392 | 9 | 4 |
| part | 2 | 613 | 27 |
| none | 0 | 4 | 29,035 |

### Verses where one set has "none" and the other set has "part" or "all"

Verses: 35. The Berean files have "none" in 4, and the King James Version files have "none" in 31.

By book: Matthew 3, Mark 3, Luke 5, John 12, Acts 4, Hebrews 5, Revelation 3.

- Matthew 26:75. Berean: part. King James Version: none.
  - Berean: Then Peter remembered the word that Jesus had spoken: [[“Before the rooster crows, you will deny Me three times.”]] And he went outside and wept bitterly.
  - King James Version: And Peter remembered the word of Jesus, which said unto him, Before the cock crow, thou shalt deny me thrice. And he went out, and wept bitterly.
- Matthew 27:43. Berean: part. King James Version: none.
  - Berean: He trusts in God. Let God deliver Him now if He wants Him. For He said, [[‘I am the Son of God.’]]”
  - King James Version: He trusted in God; let him deliver him now, if he will have him: for he said, I am the Son of God.
- Matthew 27:63. Berean: part. King James Version: none.
  - Berean: “Sir,” they said, “we remember that while He was alive that deceiver said, [[‘After three days I will rise again.’]]
  - King James Version: Saying, Sir, we remember that that deceiver said, while he was yet alive, After three days I will rise again.
- Mark 5:31. Berean: part. King James Version: none.
  - Berean: His disciples answered, “You can see the crowd pressing in on You, and yet You ask, [[‘Who touched Me?’]]”
  - King James Version: And his disciples said unto him, Thou seest the multitude thronging thee, and sayest thou, Who touched me?
- Mark 8:23. Berean: part. King James Version: none.
  - Berean: So He took the blind man by the hand and led him out of the village. Then He spit on the man’s eyes and placed His hands on him. [[“Can you see anything?”]] He asked.
  - King James Version: And he took the blind man by the hand, and led him out of the town; and when he had spit on his eyes, and put his hands upon him, he asked him if he saw ought.
- Mark 10:49. Berean: part. King James Version: none.
  - Berean: Jesus stopped and said, [[“Call him.”]] So they called the blind man. “Take courage!” they said. “Get up! He is calling for you.”
  - King James Version: And Jesus stood still, and commanded him to be called. And they call the blind man, saying unto him, Be of good comfort, rise; he calleth thee.
- Luke 9:55. Berean: none. King James Version: part.
  - Berean: But Jesus turned and rebuked them.
  - King James Version: But he turned, and rebuked them, and said, [[Ye know not what manner of spirit ye are of.]]
- Luke 9:56. Berean: none. King James Version: part.
  - Berean: And He and His disciples went on to another village.
  - King James Version: [[For the Son of man is not come to destroy men’s lives, but to save them.]] And they went to another village.
- Luke 20:23. Berean: none. King James Version: part.
  - Berean: But Jesus saw through their duplicity and said to them,
  - King James Version: But he perceived their craftiness, and said unto them, [[Why tempt ye me?]]
- Luke 22:61. Berean: part. King James Version: none.
  - Berean: And the Lord turned and looked at Peter. Then Peter remembered the word that the Lord had spoken to him: [[“Before the rooster crows today, you will deny Me three times.”]]
  - King James Version: And the Lord turned, and looked upon Peter. And Peter remembered the word of the Lord, how he had said unto him, Before the cock crow, thou shalt deny me thrice.
- Luke 24:7. Berean: all. King James Version: none.
  - Berean: [[‘The Son of Man must be delivered into the hands of sinful men, and be crucified, and on the third day rise again.’]]”
  - King James Version: Saying, The Son of man must be delivered into the hands of sinful men, and be crucified, and the third day rise again.
- John 4:53. Berean: part. King James Version: none.
  - Berean: Then the father realized that this was the very hour in which Jesus had told him, [[“Your son will live.”]] And he and all his household believed.
  - King James Version: So the father knew that it was at the same hour, in the which Jesus said unto him, Thy son liveth: and himself believed, and his whole house.
- John 5:11. Berean: part. King James Version: none.
  - Berean: But he answered, “The man who made me well told me, [[‘Pick up your mat and walk.’]]”
  - King James Version: He answered them, He that made me whole, the same said unto me, Take up thy bed, and walk.
- John 6:41. Berean: part. King James Version: none.
  - Berean: At this, the Jews began to grumble about Jesus because He had said, [[“I am the bread that came down from heaven.”]]
  - King James Version: The Jews then murmured at him, because he said, I am the bread which came down from heaven.
- John 6:42. Berean: part. King James Version: none.
  - Berean: They were asking, “Is this not Jesus, the son of Joseph, whose father and mother we know? How then can He say, [[‘I have come down from heaven’]]?”
  - King James Version: And they said, Is not this Jesus, the son of Joseph, whose father and mother we know? how is it then that he saith, I came down from heaven?
- John 7:36. Berean: part. King James Version: none.
  - Berean: What does He mean by saying, [[‘You will look for Me, but you will not find Me,’]] and, [[‘Where I am, you cannot come’]]?”
  - King James Version: What manner of saying is this that he said, Ye shall seek me, and shall not find me: and where I am, thither ye cannot come?
- John 8:22. Berean: part. King James Version: none.
  - Berean: So the Jews began to ask, “Will He kill Himself, since He says, [[‘Where I am going, you cannot come’]]?”
  - King James Version: Then said the Jews, Will he kill himself? because he saith, Whither I go, ye cannot come.
- John 13:11. Berean: part. King James Version: none.
  - Berean: For He knew who would betray Him. That is why He said, [[“Not all of you are clean.”]]
  - King James Version: For he knew who should betray him; therefore said he, Ye are not all clean.
- John 16:17. Berean: part. King James Version: none.
  - Berean: Then some of His disciples asked one another, “Why is He telling us, [[‘In a little while you will not see Me, and then after a little while you will see Me’]] and [[‘Because I am going to the Father’]]?”
  - King James Version: Then said some of his disciples among themselves, What is this that he saith unto us, A little while, and ye shall not see me: and again, a little while, and ye shall see me: and, Because I go to the Father?
- John 16:18. Berean: part. King James Version: none.
  - Berean: They kept asking, “Why is He saying, [[‘a little while’]]? We do not understand what He is saying.”
  - King James Version: They said therefore, What is this that he saith, A little while? we cannot tell what he saith.
- John 18:6. Berean: part. King James Version: none.
  - Berean: When Jesus said, [[“I am He,”]] they drew back and fell to the ground.
  - King James Version: As soon then as he had said unto them, I am he, they went backward, and fell to the ground.
- John 18:9. Berean: part. King James Version: none.
  - Berean: This was to fulfill the word He had spoken: [[“I have not lost one of those You have given Me.”]]
  - King James Version: That the saying might be fulfilled, which he spake, Of them which thou gavest me have I lost none.
- John 21:23. Berean: part. King James Version: none.
  - Berean: Because of this, the rumor spread among the brothers that this disciple would not die. However, Jesus did not say that he would not die, but only, [[“If I want him to remain until I return, what is that to you?”]]
  - King James Version: Then went this saying abroad among the brethren, that that disciple should not die: yet Jesus said not unto him, He shall not die; but, If I will that he tarry till I come, what is that to thee?
- Acts 10:13. Berean: part. King James Version: none.
  - Berean: Then a voice said to him: [[“Get up, Peter, kill and eat!”]]
  - King James Version: And there came a voice to him, Rise, Peter; kill, and eat.
- Acts 10:15. Berean: part. King James Version: none.
  - Berean: The voice spoke to him a second time: [[“Do not call anything impure that God has made clean.”]]
  - King James Version: And the voice spake unto him again the second time, What God hath cleansed, that call not thou common.
- Acts 11:7. Berean: part. King James Version: none.
  - Berean: Then I heard a voice saying to me, [[‘Get up, Peter, kill and eat.’]]
  - King James Version: And I heard a voice saying unto me, Arise, Peter; slay and eat.
- Acts 11:9. Berean: part. King James Version: none.
  - Berean: But the voice spoke from heaven a second time, [[‘Do not call anything impure that God has made clean.’]]
  - King James Version: But the voice answered me again from heaven, What God hath cleansed, that call not thou common.
- Hebrews 10:5. Berean: part. King James Version: none.
  - Berean: Therefore, when Christ came into the world, He said: [[“Sacrifice and offering You did not desire,]] [[but a body You prepared for Me.]]
  - King James Version: Wherefore when he cometh into the world, he saith, Sacrifice and offering thou wouldest not, but a body hast thou prepared me:
- Hebrews 10:6. Berean: all. King James Version: none.
  - Berean: [[In burnt offerings and sin offerings]] [[You took no delight.]]
  - King James Version: In burnt offerings and sacrifices for sin thou hast had no pleasure.
- Hebrews 10:7. Berean: all. King James Version: none.
  - Berean: [[Then I said, ‘Here I am, it is written about Me in the scroll:]] [[I have come to do Your will, O God.’”]]
  - King James Version: Then said I, Lo, I come (in the volume of the book it is written of me,) to do thy will, O God.
- Hebrews 10:8. Berean: part. King James Version: none.
  - Berean: In the passage above He says, [[“Sacrifices and offerings, burnt offerings and sin offerings You did not desire, nor did You delight in them”]] (although they are offered according to the law).
  - King James Version: Above when he said, Sacrifice and offering and burnt offerings and offering for sin thou wouldest not, neither hadst pleasure therein; which are offered by the law;
- Hebrews 10:9. Berean: part. King James Version: none.
  - Berean: Then He adds, [[“Here I am, I have come to do Your will.”]] He takes away the first to establish the second.
  - King James Version: Then said he, Lo, I come to do thy will, O God. He taketh away the first, that he may establish the second.
- Revelation 1:8. Berean: none. King James Version: part.
  - Berean: “I am the Alpha and the Omega,” says the Lord God, who is and was and is to come — the Almighty.
  - King James Version: [[I am Alpha and Omega, the beginning and the ending,]] saith the Lord, which is, and which was, and which is to come, the Almighty.
- Revelation 4:1. Berean: part. King James Version: none.
  - Berean: After this I looked and saw a door standing open in heaven. And the voice I had previously heard speak to me like a trumpet was saying, [[“Come up here, and I will show you what must happen after these things.”]]
  - King James Version: After this I looked, and, behold, a door was opened in heaven: and the first voice which I heard was as it were of a trumpet talking with me; which said, Come up hither, and I will shew thee things which must be hereafter.
- Revelation 16:15. Berean: all. King James Version: none.
  - Berean: [[“Behold, I am coming like a thief. Blessed is the one who remains awake and clothed, so that he will not go naked and let his shame be exposed.”]]
  - King James Version: Behold, I come as a thief. Blessed is he that watcheth, and keepeth his garments, lest he walk naked, and they see his shame.

### Verses where one set has "all" and the other set has "part"

Verses: 11. The Berean files have "all" in 9, and the King James Version files have "all" in 2.

By book: Matthew 2, Mark 4, Luke 4, Acts 1.

The list has 11 verses, so each verse is an example:

- Matthew 23:2. Berean: all. King James Version: part.
  - Berean: [[“The scribes and Pharisees sit in Moses’ seat.]]
  - King James Version: Saying, [[The scribes and the Pharisees sit in Moses’ seat:]]
- Matthew 28:20. Berean: all. King James Version: part.
  - Berean: [[and teaching them to obey all that I have commanded you. And surely I am with you always, even to the end of the age.”]]
  - King James Version: [[Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world.]] Amen.
- Mark 1:44. Berean: all. King James Version: part.
  - Berean: [[“See that you don’t tell anyone. But go, show yourself to the priest and present the offering Moses prescribed for your cleansing, as a testimony to them.”]]
  - King James Version: And saith unto him, [[See thou say nothing to any man: but go thy way, shew thyself to the priest, and offer for thy cleansing those things which Moses commanded, for a testimony unto them.]]
- Mark 7:19. Berean: part. King James Version: all.
  - Berean: [[because it does not enter his heart, but it goes into the stomach and then is eliminated.”]] (Thus all foods are clean.)
  - King James Version: [[Because it entereth not into his heart, but into the belly, and goeth out into the draught, purging all meats?]]
- Mark 10:33. Berean: all. King James Version: part.
  - Berean: [[“Look, we are going up to Jerusalem, and the Son of Man will be delivered over to the chief priests and scribes. They will condemn Him to death and will deliver Him over to the Gentiles,]]
  - King James Version: Saying, [[Behold, we go up to Jerusalem; and the Son of man shall be delivered unto the chief priests, and unto the scribes; and they shall condemn him to death, and shall deliver him to the Gentiles:]]
- Mark 12:37. Berean: part. King James Version: all.
  - Berean: [[David himself calls Him ‘Lord.’ So how can He be David’s son?”]] And the large crowd listened to Him with delight.
  - King James Version: [[David therefore himself calleth him Lord; and whence is he then his son? And the common people heard him gladly.]]
- Luke 7:31. Berean: all. King James Version: part.
  - Berean: [[“To what, then, can I compare the men of this generation? What are they like?]]
  - King James Version: And the Lord said, [[Whereunto then shall I liken the men of this generation? and to what are they like?]]
- Luke 18:2. Berean: all. King James Version: part.
  - Berean: [[“In a certain town there was a judge who neither feared God nor respected men.]]
  - King James Version: Saying, [[There was in a city a judge, which feared not God, neither regarded man:]]
- Luke 22:31. Berean: all. King James Version: part.
  - Berean: [[Simon, Simon, Satan has asked to sift all of you like wheat.]]
  - King James Version: And the Lord said, [[Simon, Simon, behold, Satan hath desired to have you, that he may sift you as wheat:]]
- Luke 22:42. Berean: all. King James Version: part.
  - Berean: [[“Father, if You are willing, take this cup from Me. Yet not My will, but Yours be done.”]]
  - King James Version: Saying, [[Father, if thou be willing, remove this cup from me: nevertheless not my will, but thine, be done.]]
- Acts 9:6. Berean: all. King James Version: part.
  - Berean: [[“Now get up and go into the city, and you will be told what you must do.”]]
  - King James Version: And he trembling and astonished said, Lord, what wilt thou have me to do? And the Lord said unto him, [[Arise, and go into the city, and it shall be told thee what thou must do.]]

### Verses with marks in the King James Version files that the main text of the Berean Standard Bible does not have

Verses: 8.

- Matthew 17:21. King James Version: all. [[Howbeit this kind goeth not out but by prayer and fasting.]]
- Matthew 18:11. King James Version: all. [[For the Son of man is come to save that which was lost.]]
- Matthew 23:14. King James Version: all. [[Woe unto you, scribes and Pharisees, hypocrites! for ye devour widows’ houses, and for a pretence make long prayer: therefore ye shall receive the greater damnation.]]
- Mark 7:16. King James Version: all. [[If any man have ears to hear, let him hear.]]
- Mark 9:44. King James Version: all. [[Where their worm dieth not, and the fire is not quenched.]]
- Mark 9:46. King James Version: all. [[Where their worm dieth not, and the fire is not quenched.]]
- Mark 11:26. King James Version: all. [[But if ye do not forgive, neither will your Father which is in heaven forgive your trespasses.]]
- Luke 17:36. King James Version: all. [[Two men shall be in the field; the one shall be taken, and the other left.]]

## Step 5. Passages

Each verse from each source set. The marked words are between [[ and ]].

### Matthew 3:13-17

- 3:13 Berean: At that time Jesus came from Galilee to the Jordan to be baptized by John.
- 3:13 King James Version: Then cometh Jesus from Galilee to Jordan unto John, to be baptized of him.
- 3:14 Berean: But John tried to prevent Him, saying, “I need to be baptized by You, and do You come to me?”
- 3:14 King James Version: But John forbad him, saying, I have need to be baptized of thee, and comest thou to me?
- 3:15 Berean: [[“Let it be so now,”]] Jesus replied. [[“It is fitting for us to fulfill all righteousness in this way.”]] Then John permitted Him.
- 3:15 King James Version: And Jesus answering said unto him, [[Suffer it to be so now: for thus it becometh us to fulfil all righteousness.]] Then he suffered him.
- 3:16 Berean: As soon as Jesus was baptized, He went up out of the water. Suddenly the heavens were opened, and He saw the Spirit of God descending like a dove and resting on Him.
- 3:16 King James Version: And Jesus, when he was baptized, went up straightway out of the water: and, lo, the heavens were opened unto him, and he saw the Spirit of God descending like a dove, and lighting upon him:
- 3:17 Berean: And a voice from heaven said, “This is My beloved Son, in whom I am well pleased!”
- 3:17 King James Version: And lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased.

### John 3:10-21

- 3:10 Berean: [[“You are Israel’s teacher,”]] said Jesus, [[“and you do not understand these things?]]
- 3:10 King James Version: Jesus answered and said unto him, [[Art thou a master of Israel, and knowest not these things?]]
- 3:11 Berean: [[Truly, truly, I tell you, we speak of what we know, and we testify to what we have seen, and yet you people do not accept our testimony.]]
- 3:11 King James Version: [[Verily, verily, I say unto thee, We speak that we do know, and testify that we have seen; and ye receive not our witness.]]
- 3:12 Berean: [[If I have told you about earthly things and you do not believe, how will you believe if I tell you about heavenly things?]]
- 3:12 King James Version: [[If I have told you earthly things, and ye believe not, how shall ye believe, if I tell you of heavenly things?]]
- 3:13 Berean: [[No one has ascended into heaven except the One who descended from heaven— the Son of Man.]]
- 3:13 King James Version: [[And no man hath ascended up to heaven, but he that came down from heaven, even the Son of man which is in heaven.]]
- 3:14 Berean: [[Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up,]]
- 3:14 King James Version: [[And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:]]
- 3:15 Berean: [[that everyone who believes in Him may have eternal life.]]
- 3:15 King James Version: [[That whosoever believeth in him should not perish, but have eternal life.]]
- 3:16 Berean: [[For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.]]
- 3:16 King James Version: [[For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.]]
- 3:17 Berean: [[For God did not send His Son into the world to condemn the world, but to save the world through Him.]]
- 3:17 King James Version: [[For God sent not his Son into the world to condemn the world; but that the world through him might be saved.]]
- 3:18 Berean: [[Whoever believes in Him is not condemned, but whoever does not believe has already been condemned, because he has not believed in the name of God’s one and only Son.]]
- 3:18 King James Version: [[He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.]]
- 3:19 Berean: [[And this is the verdict: The Light has come into the world, but men loved the darkness rather than the Light because their deeds were evil.]]
- 3:19 King James Version: [[And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.]]
- 3:20 Berean: [[Everyone who does evil hates the Light, and does not come into the Light for fear that his deeds will be exposed.]]
- 3:20 King James Version: [[For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved.]]
- 3:21 Berean: [[But whoever practices the truth comes into the Light, so that it may be seen clearly that what he has done has been accomplished in God.”]]
- 3:21 King James Version: [[But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God.]]

### John 3:27-36

- 3:27 Berean: John replied, “A man can receive only what is given him from heaven.
- 3:27 King James Version: John answered and said, A man can receive nothing, except it be given him from heaven.
- 3:28 Berean: You yourselves can testify that I said, ‘I am not the Christ, but am sent ahead of Him.’
- 3:28 King James Version: Ye yourselves bear me witness, that I said, I am not the Christ, but that I am sent before him.
- 3:29 Berean: The bride belongs to the bridegroom. The friend of the bridegroom stands and listens for him, and is overjoyed to hear the bridegroom’s voice. That joy is mine, and it is now complete.
- 3:29 King James Version: He that hath the bride is the bridegroom: but the friend of the bridegroom, which standeth and heareth him, rejoiceth greatly because of the bridegroom’s voice: this my joy therefore is fulfilled.
- 3:30 Berean: He must increase; I must decrease.
- 3:30 King James Version: He must increase, but I must decrease.
- 3:31 Berean: The One who comes from above is above all. The one who is from the earth belongs to the earth and speaks as one from the earth. The One who comes from heaven is above all.
- 3:31 King James Version: He that cometh from above is above all: he that is of the earth is earthly, and speaketh of the earth: he that cometh from heaven is above all.
- 3:32 Berean: He testifies to what He has seen and heard, yet no one accepts His testimony.
- 3:32 King James Version: And what he hath seen and heard, that he testifieth; and no man receiveth his testimony.
- 3:33 Berean: Whoever accepts His testimony has certified that God is truthful.
- 3:33 King James Version: He that hath received his testimony hath set to his seal that God is true.
- 3:34 Berean: For the One whom God has sent speaks the words of God, for God gives the Spirit without limit.
- 3:34 King James Version: For he whom God hath sent speaketh the words of God: for God giveth not the Spirit by measure unto him.
- 3:35 Berean: The Father loves the Son and has placed all things in His hands.
- 3:35 King James Version: The Father loveth the Son, and hath given all things into his hand.
- 3:36 Berean: Whoever believes in the Son has eternal life. Whoever rejects the Son will not see life. Instead, the wrath of God remains on him.”
- 3:36 King James Version: He that believeth on the Son hath everlasting life: and he that believeth not the Son shall not see life; but the wrath of God abideth on him.

### Acts 9:3-6

- 9:3 Berean: As Saul drew near to Damascus on his journey, suddenly a light from heaven flashed around him.
- 9:3 King James Version: And as he journeyed, he came near Damascus: and suddenly there shined round about him a light from heaven:
- 9:4 Berean: He fell to the ground and heard a voice say to him, [[“Saul, Saul, why do you persecute Me?”]]
- 9:4 King James Version: And he fell to the earth, and heard a voice saying unto him, [[Saul, Saul, why persecutest thou me?]]
- 9:5 Berean: “Who are You, Lord?” Saul asked. [[“I am Jesus, whom you are persecuting,”]] He replied.
- 9:5 King James Version: And he said, Who art thou, Lord? And the Lord said, [[I am Jesus whom thou persecutest: it is hard for thee to kick against the pricks.]]
- 9:6 Berean: [[“Now get up and go into the city, and you will be told what you must do.”]]
- 9:6 King James Version: And he trembling and astonished said, Lord, what wilt thou have me to do? And the Lord said unto him, [[Arise, and go into the city, and it shall be told thee what thou must do.]]

### Acts 20:35

- 20:35 Berean: In everything, I showed you that by this kind of hard work we must help the weak, remembering the words of the Lord Jesus Himself: [[‘It is more blessed to give than to receive.’]]”
- 20:35 King James Version: I have shewed you all things, how that so labouring ye ought to support the weak, and to remember the words of the Lord Jesus, how he said, [[It is more blessed to give than to receive.]]

### Acts 26:14-18

- 26:14 Berean: We all fell to the ground, and I heard a voice say to me in Hebrew,[[‘Saul, Saul, why do you persecute Me? It is hard for you to kick against the goads.’]]
- 26:14 King James Version: And when we were all fallen to the earth, I heard a voice speaking unto me, and saying in the Hebrew tongue, [[Saul, Saul, why persecutest thou me? it is hard for thee to kick against the pricks.]]
- 26:15 Berean: ‘Who are You, Lord?’ I asked. [[‘I am Jesus, whom you are persecuting,’]] the Lord replied.
- 26:15 King James Version: And I said, Who art thou, Lord? And he said, [[I am Jesus whom thou persecutest.]]
- 26:16 Berean: [[‘But get up and stand on your feet. For I have appeared to you to appoint you as a servant and as a witness of what you have seen from Me and what I will show you.]]
- 26:16 King James Version: [[But rise, and stand upon thy feet: for I have appeared unto thee for this purpose, to make thee a minister and a witness both of these things which thou hast seen, and of those things in the which I will appear unto thee;]]
- 26:17 Berean: [[I will rescue you from your own people and from the Gentiles. I am sending you to them]]
- 26:17 King James Version: [[Delivering thee from the people, and from the Gentiles, unto whom now I send thee,]]
- 26:18 Berean: [[to open their eyes, so that they may turn from darkness to light and from the power of Satan to God, that they may receive forgiveness of sins and an inheritance among those sanctified by faith in Me.’]]
- 26:18 King James Version: [[To open their eyes, and to turn them from darkness to light, and from the power of Satan unto God, that they may receive forgiveness of sins, and inheritance among them which are sanctified by faith that is in me.]]

### 1 Corinthians 11:23-25

- 11:23 Berean: For I received from the Lord what I also passed on to you: The Lord Jesus, on the night He was betrayed, took bread,
- 11:23 King James Version: For I have received of the Lord that which also I delivered unto you, That the Lord Jesus the same night in which he was betrayed took bread:
- 11:24 Berean: and when He had given thanks, He broke it and said, [[“This is My body, which is for you; do this in remembrance of Me.”]]
- 11:24 King James Version: And when he had given thanks, he brake it, and said, [[Take, eat: this is my body, which is broken for you: this do in remembrance of me.]]
- 11:25 Berean: In the same way, after supper He took the cup, saying, [[“This cup is the new covenant in My blood; do this, as often as you drink it, in remembrance of Me.”]]
- 11:25 King James Version: After the same manner also he took the cup, when he had supped, saying, [[This cup is the new testament in my blood: this do ye, as oft as ye drink it, in remembrance of me.]]

### 2 Corinthians 12:9

- 12:9 Berean: But He said to me, [[“My grace is sufficient for you, for My power is perfected in weakness.”]] Therefore I will boast all the more gladly in my weaknesses, so that the power of Christ may rest on me.
- 12:9 King James Version: And he said unto me, [[My grace is sufficient for thee: for my strength is made perfect in weakness.]] Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.

### Hebrews: each verse that has marks in the Berean files

- 10:5 Berean: Therefore, when Christ came into the world, He said: [[“Sacrifice and offering You did not desire,]] [[but a body You prepared for Me.]]
- 10:5 King James Version: Wherefore when he cometh into the world, he saith, Sacrifice and offering thou wouldest not, but a body hast thou prepared me:
- 10:6 Berean: [[In burnt offerings and sin offerings]] [[You took no delight.]]
- 10:6 King James Version: In burnt offerings and sacrifices for sin thou hast had no pleasure.
- 10:7 Berean: [[Then I said, ‘Here I am, it is written about Me in the scroll:]] [[I have come to do Your will, O God.’”]]
- 10:7 King James Version: Then said I, Lo, I come (in the volume of the book it is written of me,) to do thy will, O God.
- 10:8 Berean: In the passage above He says, [[“Sacrifices and offerings, burnt offerings and sin offerings You did not desire, nor did You delight in them”]] (although they are offered according to the law).
- 10:8 King James Version: Above when he said, Sacrifice and offering and burnt offerings and offering for sin thou wouldest not, neither hadst pleasure therein; which are offered by the law;
- 10:9 Berean: Then He adds, [[“Here I am, I have come to do Your will.”]] He takes away the first to establish the second.
- 10:9 King James Version: Then said he, Lo, I come to do thy will, O God. He taketh away the first, that he may establish the second.

### Revelation 1:8-20

- 1:8 Berean: “I am the Alpha and the Omega,” says the Lord God, who is and was and is to come — the Almighty.
- 1:8 King James Version: [[I am Alpha and Omega, the beginning and the ending,]] saith the Lord, which is, and which was, and which is to come, the Almighty.
- 1:9 Berean: I, John, your brother and partner in the tribulation and kingdom and perseverance that are in Jesus, was on the island of Patmos because of the word of God and my testimony about Jesus.
- 1:9 King James Version: I John, who also am your brother, and companion in tribulation, and in the kingdom and patience of Jesus Christ, was in the isle that is called Patmos, for the word of God, and for the testimony of Jesus Christ.
- 1:10 Berean: On the Lord’s day I was in the Spirit, and I heard behind me a loud voice like a trumpet,
- 1:10 King James Version: I was in the Spirit on the Lord’s day, and heard behind me a great voice, as of a trumpet,
- 1:11 Berean: saying,[[“Write on a scroll what you see and send it to the seven churches: to Ephesus, Smyrna, Pergamum, Thyatira, Sardis, Philadelphia, and Laodicea.”]]
- 1:11 King James Version: Saying, [[I am Alpha and Omega, the first and the last:]] and, [[What thou seest, write in a book, and send it unto the seven churches which are in Asia; unto Ephesus, and unto Smyrna, and unto Pergamos, and unto Thyatira, and unto Sardis, and unto Philadelphia, and unto Laodicea.]]
- 1:12 Berean: Then I turned to see the voice that was speaking with me. And having turned, I saw seven golden lampstands,
- 1:12 King James Version: And I turned to see the voice that spake with me. And being turned, I saw seven golden candlesticks;
- 1:13 Berean: and among the lampstands was One like the Son of Man, dressed in a long robe, with a golden sash around His chest.
- 1:13 King James Version: And in the midst of the seven candlesticks one like unto the Son of man, clothed with a garment down to the foot, and girt about the paps with a golden girdle.
- 1:14 Berean: The hair of His head was white like wool, as white as snow, and His eyes were like a blazing fire.
- 1:14 King James Version: His head and his hairs were white like wool, as white as snow; and his eyes were as a flame of fire;
- 1:15 Berean: His feet were like polished bronze refined in a furnace, and His voice was like the roar of many waters.
- 1:15 King James Version: And his feet like unto fine brass, as if they burned in a furnace; and his voice as the sound of many waters.
- 1:16 Berean: He held in His right hand seven stars, and a sharp double-edged sword came from His mouth. His face was like the sun shining at its brightest.
- 1:16 King James Version: And he had in his right hand seven stars: and out of his mouth went a sharp twoedged sword: and his countenance was as the sun shineth in his strength.
- 1:17 Berean: When I saw Him, I fell at His feet like a dead man. But He placed His right hand on me and said, [[“Do not be afraid. I am the First and the Last,]]
- 1:17 King James Version: And when I saw him, I fell at his feet as dead. And he laid his right hand upon me, saying unto me, [[Fear not; I am the first and the last:]]
- 1:18 Berean: [[the Living One. I was dead, and behold, now I am alive forever and ever! And I hold the keys of Death and of Hades.]]
- 1:18 King James Version: [[I am he that liveth, and was dead; and, behold, I am alive for evermore, Amen; and have the keys of hell and of death.]]
- 1:19 Berean: [[Therefore write down the things you have seen, the things that are, and the things that will happen after this.]]
- 1:19 King James Version: [[Write the things which thou hast seen, and the things which are, and the things which shall be hereafter;]]
- 1:20 Berean: [[This is the mystery of the seven stars you saw in My right hand and of the seven golden lampstands: The seven stars are the angels of the seven churches, and the seven lampstands are the seven churches.[’’]]]
- 1:20 King James Version: [[The mystery of the seven stars which thou sawest in my right hand, and the seven golden candlesticks. The seven stars are the angels of the seven churches: and the seven candlesticks which thou sawest are the seven churches.]]

### Revelation 22:7-20

- 22:7 Berean: [[“Behold, I am coming soon. Blessed is the one who keeps the words of prophecy in this book.”]]
- 22:7 King James Version: [[Behold, I come quickly: blessed is he that keepeth the sayings of the prophecy of this book.]]
- 22:8 Berean: And I, John, am the one who heard and saw these things. And when I had heard and seen them, I fell down to worship at the feet of the angel who had shown me these things.
- 22:8 King James Version: And I John saw these things, and heard them. And when I had heard and seen, I fell down to worship before the feet of the angel which shewed me these things.
- 22:9 Berean: But he said to me, “Do not do that! I am a fellow servant with you and your brothers the prophets, and with those who keep the words of this book. Worship God!”
- 22:9 King James Version: Then saith he unto me, See thou do it not: for I am thy fellowservant, and of thy brethren the prophets, and of them which keep the sayings of this book: worship God.
- 22:10 Berean: Then he told me, “Do not seal up the words of prophecy in this book, because the time is near.
- 22:10 King James Version: And he saith unto me, Seal not the sayings of the prophecy of this book: for the time is at hand.
- 22:11 Berean: Let the unrighteous continue to be unrighteous, and the vile continue to be vile; let the righteous continue to practice righteousness, and the holy continue to be holy.”
- 22:11 King James Version: He that is unjust, let him be unjust still: and he which is filthy, let him be filthy still: and he that is righteous, let him be righteous still: and he that is holy, let him be holy still.
- 22:12 Berean: [[“Behold, I am coming soon, and My reward is with Me, to give to each one according to what he has done.]]
- 22:12 King James Version: [[And, behold, I come quickly; and my reward is with me, to give every man according as his work shall be.]]
- 22:13 Berean: [[I am the Alpha and the Omega, the First and the Last, the Beginning and the End.”]]
- 22:13 King James Version: [[I am Alpha and Omega, the beginning and the end, the first and the last.]]
- 22:14 Berean: Blessed are those who wash their robes, so that they may have the right to the tree of life and may enter the city by its gates.
- 22:14 King James Version: Blessed are they that do his commandments, that they may have right to the tree of life, and may enter in through the gates into the city.
- 22:15 Berean: But outside are the dogs, the sorcerers, the sexually immoral, the murderers, the idolaters, and everyone who loves and practices falsehood.
- 22:15 King James Version: For without are dogs, and sorcerers, and whoremongers, and murderers, and idolaters, and whosoever loveth and maketh a lie.
- 22:16 Berean: [[“I, Jesus, have sent My angel to give you this testimony for the churches. I am the Root and the Offspring of David, the bright Morning Star.”]]
- 22:16 King James Version: [[I Jesus have sent mine angel to testify unto you these things in the churches. I am the root and the offspring of David, and the bright and morning star.]]
- 22:17 Berean: The Spirit and the bride say, “Come!” Let the one who hears say, “Come!” And let the one who is thirsty come, and the one who desires the water of life drink freely.
- 22:17 King James Version: And the Spirit and the bride say, Come. And let him that heareth say, Come. And let him that is athirst come. And whosoever will, let him take the water of life freely.
- 22:18 Berean: I testify to everyone who hears the words of prophecy in this book: If anyone adds to them, God will add to him the plagues described in this book.
- 22:18 King James Version: For I testify unto every man that heareth the words of the prophecy of this book, If any man shall add unto these things, God shall add unto him the plagues that are written in this book:
- 22:19 Berean: And if anyone takes away from the words of this book of prophecy, God will take away his share in the tree of life and the holy city, which are described in this book.
- 22:19 King James Version: And if any man shall take away from the words of the book of this prophecy, God shall take away his part out of the book of life, and out of the holy city, and from the things which are written in this book.
- 22:20 Berean: He who testifies to these things says, [[“Yes, I am coming soon.”]] Amen. Come, Lord Jesus!
- 22:20 King James Version: He which testifieth these things saith, [[Surely I come quickly.]] Amen. Even so, come, Lord Jesus.

## Step 6. The Berean marks and the words of the site

The script takes the plain words of each mark in each verse, and searches them in the words of that verse in `public/data/text/<id>.json`. The search counts a run of spaces as one space, and changes no other character. A mark is found when each of its verses is found.

- Marks: 1,420. Marks with no words to search, because they have no character that is not a space: 0.
- Marks that the script finds exactly in the words of the site: 1,373.
- Marks that the script does not find: 47.
- Marks whose words are in more than one text block of the site data: 0. Of these, 0 have the words of one verse only, and 0 have the words of more than one verse.

The script searches the marks that it does not find two more times, to sort them:

- Found when the script removes each space from the two texts: 38.
- Found only when the script also removes the characters `[’’]` from the words of the mark: 9.
- Not found by these two searches: 0.

The marks that the script does not find, by book: Matthew 9, Mark 8, Luke 11, John 13, Revelation 6.

- Matthew 5:48.
  - Verse 48, the words of the mark: Be perfect, therefore, as your heavenly Father is perfect.[’’]
  - Verse 48, the words in `public/data/text/`: Be perfect, therefore, as your heavenly Father is perfect.
- Matthew 6:34.
  - Verse 34, the words of the mark: Therefore do not worry about tomorrow, for tomorrow will worry about itself. Today has enough trouble of its own.[’’]
  - Verse 34, the words in `public/data/text/`: Therefore do not worry about tomorrow, for tomorrow will worry about itself. Today has enough trouble of its own.
- Matthew 7:26.
  - Verse 27, the words of the mark: The rain fell, the torrents raged, and the winds blew and beat against that house, and it fell— and great was its collapse!”
  - Verse 27, the words in `public/data/text/`: The rain fell, the torrents raged, and the winds blew and beat against that house, and it fell—and great was its collapse!”
- Matthew 13:8.
  - Verse 8, the words of the mark: Still other seed fell on good soil and produced a crop — a hundredfold, sixtyfold, or thirtyfold.
  - Verse 8, the words in `public/data/text/`: Still other seed fell on good soil and produced a crop—a hundredfold, sixtyfold, or thirtyfold.
- Matthew 13:23.
  - Verse 23, the words of the mark: But the seed sown on good soil is the one who hears the word and understands it. He indeed bears fruit and produces a crop — a hundredfold, sixtyfold, or thirtyfold.”
  - Verse 23, the words in `public/data/text/`: But the seed sown on good soil is the one who hears the word and understands it. He indeed bears fruit and produces a crop—a hundredfold, sixtyfold, or thirtyfold.”
- Matthew 19:28.
  - Verse 30, the words of the mark: But many who are first will be last, and the last will be first.[’’]
  - Verse 30, the words in `public/data/text/`: But many who are first will be last, and the last will be first.
- Matthew 20:25.
  - Verse 27, the words of the mark: and whoever wants to be first among you must be your slave —
  - Verse 27, the words in `public/data/text/`: and whoever wants to be first among you must be your slave—
- Matthew 24:48.
  - Verse 51, the words of the mark: Then he will cut him to pieces and assign him a place with the hypocrites, where there will be weeping and gnashing of teeth.[’’]
  - Verse 51, the words in `public/data/text/`: Then he will cut him to pieces and assign him a place with the hypocrites, where there will be weeping and gnashing of teeth.
- Matthew 25:14.
  - Verse 15, the words of the mark: To one he gave five talents, to another two talents, and to another one talent — each according to his own ability. And he went on his journey.
  - Verse 15, the words in `public/data/text/`: To one he gave five talents, to another two talents, and to another one talent—each according to his own ability. And he went on his journey.
- Mark 4:8.
  - Verse 8, the words of the mark: Still other seed fell on good soil, where it sprouted, grew up, and produced a crop — one bearing thirtyfold, another sixtyfold, and another a hundredfold.”
  - Verse 8, the words in `public/data/text/`: Still other seed fell on good soil, where it sprouted, grew up, and produced a crop—one bearing thirtyfold, another sixtyfold, and another a hundredfold.”
- Mark 4:20.
  - Verse 20, the words of the mark: Still others are like the seeds sown on good soil. They hear the word, receive it, and produce a crop — thirtyfold, sixtyfold, or a hundredfold.”
  - Verse 20, the words in `public/data/text/`: Still others are like the seeds sown on good soil. They hear the word, receive it, and produce a crop—thirtyfold, sixtyfold, or a hundredfold.”
- Mark 4:26.
  - Verse 28, the words of the mark: All by itself the earth produces a crop— first the stalk, then the head, then grain that ripens within.
  - Verse 28, the words in `public/data/text/`: All by itself the earth produces a crop—first the stalk, then the head, then grain that ripens within.
- Mark 7:9.
  - Verse 11, the words of the mark: But you say that if a man says to his father or mother, ‘Whatever you would have received from me is Corban’ (that is, a gift devoted to God ),
  - Verse 11, the words in `public/data/text/`: But you say that if a man says to his father or mother, ‘Whatever you would have received from me is Corban’ (that is, a gift devoted to God),
- Mark 10:29.
  - Verse 30, the words of the mark: will fail to receive a hundredfold in the present age — houses and brothers and sisters and mothers and children and fields, along with persecutions — and in the age to come, eternal life.
  - Verse 30, the words in `public/data/text/`: will fail to receive a hundredfold in the present age—houses and brothers and sisters and mothers and children and fields, along with persecutions—and in the age to come, eternal life.
- Mark 11:29.
  - Verse 30, the words of the mark: John’s baptism — was it from heaven or from men? Answer Me!”
  - Verse 30, the words in `public/data/text/`: John’s baptism—was it from heaven or from men? Answer Me!”
- Mark 13:34.
  - Verse 35, the words of the mark: Therefore keep watch, because you do not know when the master of the house will return — whether in the evening, at midnight, when the rooster crows, or in the morning.
  - Verse 35, the words in `public/data/text/`: Therefore keep watch, because you do not know when the master of the house will return—whether in the evening, at midnight, when the rooster crows, or in the morning.
- Mark 14:20.
  - Verse 20, the words of the mark: “It is one of the Twelve — the one who is dipping his hand into the bowl with Me.
  - Verse 20, the words in `public/data/text/`: He answered, “It is one of the Twelve—the one who is dipping his hand into the bowl with Me.
- Luke 4:24.
  - Verse 27, the words of the mark: And there were many lepers in Israel in the time of Elisha the prophet. Yet not one of them was cleansed— only Naaman the Syrian.”
  - Verse 27, the words in `public/data/text/`: And there were many lepers in Israel in the time of Elisha the prophet. Yet not one of them was cleansed—only Naaman the Syrian.”
- Luke 6:49.
  - Verse 49, the words of the mark: But the one who hears My words and does not act on them is like a man who built his house on ground without a foundation. The torrent crashed against that house, and immediately it fell — and great was its destruction!”
  - Verse 49, the words in `public/data/text/`: But the one who hears My words and does not act on them is like a man who built his house on ground without a foundation. The torrent crashed against that house, and immediately it fell—and great was its destruction!”
- Luke 8:8.
  - Verse 8, the words of the mark: Still other seed fell on good soil, where it sprang up and produced a crop — a hundredfold.”
  - Verse 8, the words in `public/data/text/`: Still other seed fell on good soil, where it sprang up and produced a crop—a hundredfold.” As Jesus said this, He called out, “He who has ears to hear, let him hear.”
- Luke 14:26.
  - Verse 26, the words of the mark: “If anyone comes to Me and does not hate his father and mother and wife and children and brothers and sisters — yes, even his own life — he cannot be My disciple.
  - Verse 26, the words in `public/data/text/`: “If anyone comes to Me and does not hate his father and mother and wife and children and brothers and sisters—yes, even his own life—he cannot be My disciple.
- Luke 18:10.
  - Verse 11, the words of the mark: The Pharisee stood by himself and prayed, ‘God, I thank You that I am not like other men — swindlers, evildoers, adulterers — or even like this tax collector.
  - Verse 11, the words in `public/data/text/`: The Pharisee stood by himself and prayed, ‘God, I thank You that I am not like other men—swindlers, evildoers, adulterers—or even like this tax collector.
- Luke 18:29.
  - Verse 30, the words of the mark: will fail to receive many times more in this age — and in the age to come, eternal life.”
  - Verse 30, the words in `public/data/text/`: will fail to receive many times more in this age—and in the age to come, eternal life.”
- Luke 19:26.
  - Verse 26, the words of the mark: He replied, ‘ I tell you that everyone who has will be given more; but the one who does not have, even what he has will be taken away from him.
  - Verse 26, the words in `public/data/text/`: He replied, ‘I tell you that everyone who has will be given more; but the one who does not have, even what he has will be taken away from him.
- Luke 19:42.
  - Verse 44, the words of the mark: They will level you to the ground — you and the children within your walls. They will not leave one stone on another, because you did not recognize the time of your visitation from God.”
  - Verse 44, the words in `public/data/text/`: They will level you to the ground—you and the children within your walls. They will not leave one stone on another, because you did not recognize the time of your visitation from God.”
- Luke 20:3.
  - Verse 4, the words of the mark: John’s baptism — was it from heaven, or from men?”
  - Verse 4, the words in `public/data/text/`: John’s baptism—was it from heaven, or from men?”
- Luke 21:34.
  - Verse 34, the words of the mark: But watch yourselves, or your hearts will be weighed down by dissipation, drunkenness, and the worries of life — and that day will spring upon you suddenly like a snare.
  - Verse 34, the words in `public/data/text/`: But watch yourselves, or your hearts will be weighed down by dissipation, drunkenness, and the worries of life—and that day will spring upon you suddenly like a snare.
- Luke 24:38.
  - Verse 39, the words of the mark: Look at My hands and My feet. It is I Myself. Touch Me and see — for a spirit does not have flesh and bones, as you see I have.”
  - Verse 39, the words in `public/data/text/`: Look at My hands and My feet. It is I Myself. Touch Me and see—for a spirit does not have flesh and bones, as you see I have.”
- John 3:12.
  - Verse 13, the words of the mark: No one has ascended into heaven except the One who descended from heaven— the Son of Man.
  - Verse 13, the words in `public/data/text/`: No one has ascended into heaven except the One who descended from heaven—the Son of Man.
- John 5:28.
  - Verse 29, the words of the mark: and come out — those who have done good to the resurrection of life, and those who have done evil to the resurrection of judgment.
  - Verse 29, the words in `public/data/text/`: and come out—those who have done good to the resurrection of life, and those who have done evil to the resurrection of judgment.
- John 5:35.
  - Verse 36, the words of the mark: But I have testimony more substantial than that of John. For the works that the Father has given Me to accomplish — the very works I am doing — testify about Me that the Father has sent Me.
  - Verse 36, the words in `public/data/text/`: But I have testimony more substantial than that of John. For the works that the Father has given Me to accomplish—the very works I am doing—testify about Me that the Father has sent Me.
- John 6:44.
  - Verse 45, the words of the mark: It is written in the Prophets: ‘And they will all be taught by God.’ Everyone who has heard the Father and learned from Him comes to Me —
  - Verse 45, the words in `public/data/text/`: It is written in the Prophets: ‘And they will all be taught by God.’ Everyone who has heard the Father and learned from Him comes to Me—
- John 10:34.
  - Verse 35, the words of the mark: If he called them gods to whom the word of God came — and the Scripture cannot be broken —
  - Verse 35, the words in `public/data/text/`: If he called them gods to whom the word of God came—and the Scripture cannot be broken—
- John 13:31.
  - Verse 32, the words of the mark: If God is glorified in Him, God will also glorify the Son in Himself — and will glorify Him at once.
  - Verse 32, the words in `public/data/text/`: If God is glorified in Him, God will also glorify the Son in Himself—and will glorify Him at once.
- John 13:38.
  - Verse 38, the words of the mark: “Truly, truly, I tell you, before the rooster crows, you will deny Me three times.[’’]
  - Verse 38, the words in `public/data/text/`: “Will you lay down your life for Me?” Jesus replied. “Truly, truly, I tell you, before the rooster crows, you will deny Me three times.
- John 14:9.
  - Verse 11, the words of the mark: Believe Me that I am in the Father and the Father is in Me — or at least believe on account of the works themselves.
  - Verse 11, the words in `public/data/text/`: Believe Me that I am in the Father and the Father is in Me—or at least believe on account of the works themselves.
- John 14:15.
  - Verse 16, the words of the mark: And I will ask the Father, and He will give you another Advocate to be with you forever —
  - Verse 16, the words in `public/data/text/`: And I will ask the Father, and He will give you another Advocate to be with you forever—
- John 14:31.
  - Verse 31, the words of the mark: Get up! Let us go on from here.[’’]
  - Verse 31, the words in `public/data/text/`: But I do exactly what the Father has commanded Me, so that the world may know that I love the Father. Get up! Let us go on from here.
- John 15:14.
  - Verse 16, the words of the mark: You did not choose Me, but I chose you. And I appointed you to go and bear fruit — fruit that will remain — so that whatever you ask the Father in My name, He will give you.
  - Verse 16, the words in `public/data/text/`: You did not choose Me, but I chose you. And I appointed you to go and bear fruit—fruit that will remain—so that whatever you ask the Father in My name, He will give you.
- John 15:26.
  - Verse 26, the words of the mark: When the Advocate comes, whom I will send to you from the Father — the Spirit of truth who proceeds from the Father — He will testify about Me.
  - Verse 26, the words in `public/data/text/`: When the Advocate comes, whom I will send to you from the Father—the Spirit of truth who proceeds from the Father—He will testify about Me.
  - Verse 27, the words of the mark: And you also must testify, because you have been with Me from the beginning.[’’]
  - Verse 27, the words in `public/data/text/`: And you also must testify, because you have been with Me from the beginning.
- John 17:22.
  - Verse 22, the words of the mark: I have given them the glory You gave Me, so that they may be one as We are one —
  - Verse 22, the words in `public/data/text/`: I have given them the glory You gave Me, so that they may be one as We are one—
  - Verse 23, the words of the mark: I in them and You in Me — that they may be perfectly united, so that the world may know that You sent Me and have loved them just as You have loved Me.
  - Verse 23, the words in `public/data/text/`: I in them and You in Me—that they may be perfectly united, so that the world may know that You sent Me and have loved them just as You have loved Me.
- Revelation 1:19.
  - Verse 20, the words of the mark: This is the mystery of the seven stars you saw in My right hand and of the seven golden lampstands: The seven stars are the angels of the seven churches, and the seven lampstands are the seven churches.[’’]
  - Verse 20, the words in `public/data/text/`: This is the mystery of the seven stars you saw in My right hand and of the seven golden lampstands: The seven stars are the angels of the seven churches, and the seven lampstands are the seven churches.
- Revelation 2:9.
  - Verse 9, the words of the mark: I know your affliction and your poverty — though you are rich! And I am aware of the slander of those who falsely claim to be Jews, but are in fact a synagogue of Satan.
  - Verse 9, the words in `public/data/text/`: I know your affliction and your poverty—though you are rich! And I am aware of the slander of those who falsely claim to be Jews, but are in fact a synagogue of Satan.
- Revelation 2:19.
  - Verse 19, the words of the mark: I know your deeds — your love, your faith, your service, your perseverance — and your latest deeds are greater than your first.
  - Verse 19, the words in `public/data/text/`: I know your deeds—your love, your faith, your service, your perseverance—and your latest deeds are greater than your first.
- Revelation 2:24.
  - Verse 27, the words of the mark: He will rule them with an iron scepter and shatter them like pottery — just as I have received authority from My Father.
  - Verse 27, the words in `public/data/text/`: He will rule them with an iron scepter and shatter them like pottery—just as I have received authority from My Father.
- Revelation 2:29.
  - Verse 29, the words of the mark: He who has an ear, let him hear what the Spirit says to the churches.[’’]
  - Verse 29, the words in `public/data/text/`: He who has an ear, let him hear what the Spirit says to the churches.
- Revelation 3:15.
  - Verse 16, the words of the mark: So because you are lukewarm — neither hot nor cold — I am about to vomit you out of My mouth!
  - Verse 16, the words in `public/data/text/`: So because you are lukewarm—neither hot nor cold—I am about to vomit you out of My mouth!

## Step 7. The King James Version marks and the words of the site

The same test, in `public/data/text-kjv/<id>.json`. The added words count as words of the verse.

- Marks: 2,038. Marks with no words to search, because they have no character that is not a space: 0.
- Marks that the script finds exactly in the words of the site: 2,038.
- Marks that the script does not find: 0.
- Marks whose words are in more than one text block of the site data: 0. Of these, 0 have the words of one verse only, and 0 have the words of more than one verse.
- Marks in one of the 13 verses where the site joins a word: 0.

## Step 8. The block styles of the marked words

For each verse with marked words that the script finds in the site data, the block styles that hold the marked words. A verse with marked words in two styles counts once in each style. Paragraph style: `p`. Poetry styles: `q1`, `q2`, `qr`. The marks that the script does not find are not counted.

### Berean Standard Bible

Verses with marked words: 1,943. Verses with marked words in more than one style: 61.

| Block style | Kind | Verses |
|---|---|---:|
| `p` | paragraph | 1,875 |
| `q1` | poetry | 57 |
| `q2` | poetry | 53 |
| `pmo` | other | 41 |

### King James Version

Verses with marked words: 2,028. Verses with marked words in more than one style: 0.

| Block style | Kind | Verses |
|---|---|---:|
| `p` | paragraph | 1,954 |
| `pmo` | other | 44 |
| `q1` | poetry | 30 |

## Step 9. Two forms for the marks in the site data

The script makes each form in memory for each book, and counts the bytes of `JSON.stringify` in UTF-8. It writes no file. The marks that the script does not find in step 6 or step 7 are not in the counts.

- Form A, inline items: each run of marked words in a text block becomes an item `{"j":"words"}` in place of the plain string. Added words in a mark get `"j":1`, for example `{"a":"it","j":1}`. A mark that has words in two blocks gives one item in each block.
- Form B, ranges per chapter: each chapter gets a list `"j":[[verse,from,to],...]`. `from` and `to` are positions in the words of the verse, as the site data has them now. The text blocks do not change.

| Data | Size now | Form A adds | Form B adds |
|---|---:|---:|---:|
| `public/data/text/` | 5,555,106 | 16,101 (0.29 %) | 23,965 (0.43 %) |
| `public/data/text-kjv/` | 5,565,976 | 21,720 (0.39 %) | 22,461 (0.40 %) |


## Proposals

Each point gives the options and the cost of each option. The numbers are from steps 3 to 9. This report does not choose an option.

### 1. Which marks each translation uses

- Option (a): each translation uses the marks of its own source files.
  - Cost: the build of the Berean data must place 47 marks that do not fit the words of the site exactly. Step 6 and point 2 below.
  - Cost: the two translations mark different verses. In 35 verses, one set has marks and the other set has none. In 11 verses, one set marks all the words and the other set marks some. When the reader changes the translation, the marked words change in these 46 verses.
  - Cost: the King James Version marks 8 verses that are not in the main text of the Berean Standard Bible. Step 4.
  - Cost: `CLAUDE.md` has Arthur's rule "a translation changes only the words". With this option, a change of the translation also changes the marks in the 46 verses above.
- Option (b): the two translations use the Berean marks.
  - Cost: the words of the two translations are different. A Berean mark gives a place in the Berean words, not in the King James Version words. This option needs a method to move each of the 1,420 Berean marks to the King James Version words. The script did not test a method. I did not search the repository for a method.
  - Cost: the 8 King James Version verses of step 4 that the Berean main text does not have get no marks, because the Berean files have no such verse.
- Option (c): each translation uses its own marks, but only in the verses where the two sets have marks.
  - This option differs from the task. Task 25 names the option "only the words that the two sets agree on". The script cannot compare words across two translations, so this option compares verses.
  - Cost: the two sets agree on a verse with marks in 2,016 verses: the classes "all" and "part" in the two sets, from the table of step 4. The words that the two sets mark inside a verse can still differ. The script can compare classes of verses. It cannot compare words across two translations.
  - Cost: the Berean Standard Bible loses the marks of 31 verses, and the King James Version loses the marks of 4 verses and of the 8 verses that the Berean main text does not have.

### 2. What the site does with a mark that does not fit the words of the site

Step 6 found 47 Berean marks that the script does not find exactly. Step 7 found none for the King James Version.

- Option (a): the build places these marks with a search that removes the spaces, and removes the characters `[’’]` from the words of the mark. `scripts/build-text.mjs` already aligns the USFM files with `bsb.txt` with the spaces removed.
  - Cost: more code in the build script, and a test for the 47 marks. Step 6 shows that the two searches find each of the 47 marks: 38 with the spaces removed, and 9 with the spaces and `[’’]` removed.
- Option (b): the site leaves out the 47 marks.
  - Cost: 47 marks in Matthew, Mark, Luke, John, and Revelation have no marked words on the site. In step 6, a mark can have words of more than one verse, so the marked words of more than one verse can be lost for one mark. Example: the mark at Mark 10:29 has words of verse 30.
- Option (c): Arthur reads the list of the 47 marks in step 6, and decides for each mark.
  - Cost: 47 decisions.

### 3. What the site does with the verses where one set has "none" and the other does not

Step 4 lists 35 verses. The Berean files have marks and the King James Version files have none in 31 verses. The King James Version files have marks and the Berean files have none in 4 verses.

- Option (a): each translation shows its own marks in these verses.
  - Cost: the 35 verses look different in the two translations. The reader who changes the translation sees marked words appear or go.
- Option (b): the site shows no marks in these 35 verses, in the two translations.
  - Cost: the Berean Standard Bible loses the marks of 31 verses, and the King James Version loses the marks of 4 verses.
- Option (c): Arthur reads the 35 verses in step 4, and decides for each verse.
  - Cost: 35 decisions. A decision to add a mark that a source does not have is new content, and needs a named source by the hard rules of `CLAUDE.md`.

### 4. The form of the marks in the site data

Step 9 gives the bytes of two forms. The Berean numbers do not include the 47 marks of step 6 that the exact search does not find. With these 47 marks, the Berean numbers will be larger. The script did not count them.

- Option (a): Form A, inline items `{"j":"words"}`, and `"j":1` on added words in a mark.
  - Cost: 16,101 bytes more in `public/data/text/`, 0.29 %, without the 47 marks of step 6. 21,720 bytes more in `public/data/text-kjv/`, 0.39 %.
  - Cost: the code that reads a text block gets a new kind of item. The unit tests that compare the words of each verse with the sources must read the new item as words.
- Option (b): Form B, a list of ranges for each chapter, `"j":[[verse,from,to],...]`.
  - Cost: 23,965 bytes more in `public/data/text/`, 0.43 %, without the 47 marks of step 6. 22,461 bytes more in `public/data/text-kjv/`, 0.40 %.
  - Cost: the text blocks do not change, so the tests of the words do not change. The page must cut the strings at the positions when it shows a verse. A position is correct only while the words of the verse do not change. In the King James Version, no mark is in one of the 13 verses where the site joins a word. Step 7.
