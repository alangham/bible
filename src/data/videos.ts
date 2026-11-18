// The video list: the overview videos of BibleProject on YouTube. docs/DESIGN.md section 17, docs/TASKS.md Task 42.
// Section 17.5 is the only source of a video id. No person and no agent adds, removes, or changes an id without a
// decision of Arthur. The ids are in the order of the two playlists. The site has links only: section 17.2.

/** The videos of one book: one or two video ids, and the sentence of the shared video if the video covers more books. */
export interface BookVideos {
  videos: readonly string[]
  shared?: string
}

/** The address of a video: section 17.3, with no other parameter. */
export const videoHref = (id: string) => `https://www.youtube.com/watch?v=${id}`

/** The credit of section 17.3, in the words that BibleProject gives. Do not change a character. */
export const VIDEO_CREDIT = {
  before: 'BibleProject is the author and owner of this content. To find more BibleProject resources, visit ',
  link: 'bibleproject.com',
  after: '.',
  href: 'https://www.bibleproject.com/',
} as const

/** The two summary videos: rows 1 of the two playlists. They are on the Sources page only. Section 17.6. */
export const SUMMARY_VIDEOS = {
  oldTestament: 'ALsluAKBZ-c',
  newTestament: 'Q0BrP8bqj0c',
} as const

/** The videos of each book id of public/data/books.json. */
export const BOOK_VIDEOS: Readonly<Record<string, BookVideos>> = {
  genesis: { videos: ['GQI72THyO5I', 'F4isSyennFo'] },
  exodus: { videos: ['jH_aojNJM3E', 'oNpTha80yyE'] },
  leviticus: { videos: ['IJ-FekWUZzE'] },
  numbers: { videos: ['tp5MIrMZFqo'] },
  deuteronomy: { videos: ['q5QEH9bH8AU'] },
  joshua: { videos: ['JqOqJlFF_eU'] },
  judges: { videos: ['kOYy8iCfIJ4'] },
  '1-samuel': { videos: ['QJOju5Dw0V0'] },
  '2-samuel': { videos: ['YvoWDXNDJgs'] },
  '1-kings': { videos: ['bVFW3wbi9pk'], shared: 'The video covers 1 and 2 Kings.' },
  '2-kings': { videos: ['bVFW3wbi9pk'], shared: 'The video covers 1 and 2 Kings.' },
  isaiah: { videos: ['d0A6Uchb1F8', '_TzdEPuqgQg'] },
  jeremiah: { videos: ['RSK36cHbrk0'] },
  ezekiel: { videos: ['R-CIPu1nko8', 'SDeCWW_Bnyw'] },
  hosea: { videos: ['kE6SZ1ogOVU'] },
  joel: { videos: ['zQLazbgz90c'] },
  amos: { videos: ['mGgWaPGpGz4'] },
  obadiah: { videos: ['i4ogCrEoG5s'] },
  jonah: { videos: ['dLIabZc0O4c'] },
  micah: { videos: ['MFEUEcylwLc'] },
  nahum: { videos: ['Y30DanA5EhU'] },
  habakkuk: { videos: ['OPMaRqGJPUU'] },
  zephaniah: { videos: ['oFZknKPNvz8'] },
  haggai: { videos: ['juPvv_xcX-U'] },
  zechariah: { videos: ['_106IfO6Kc0'] },
  malachi: { videos: ['HPGShWZ4Jvk'] },
  psalms: { videos: ['j9phNEaPrv8'] },
  proverbs: { videos: ['AzmYV8GNAIM'] },
  job: { videos: ['xQwnH8th_fs'] },
  'song-of-solomon': { videos: ['4KC7xE4fgOw'] },
  ruth: { videos: ['0h1eoBeR4Jk'] },
  lamentations: { videos: ['p8GDFPdaQZQ'] },
  ecclesiastes: { videos: ['lrsQ1tc-2wk'] },
  esther: { videos: ['JydNSlufRIs'] },
  daniel: { videos: ['9cSC9uobtPM'] },
  ezra: { videos: ['MkETkRv9tG8'], shared: 'The video covers Ezra and Nehemiah.' },
  nehemiah: { videos: ['MkETkRv9tG8'], shared: 'The video covers Ezra and Nehemiah.' },
  '1-chronicles': { videos: ['HR7xaHv3Ias'], shared: 'The video covers 1 and 2 Chronicles.' },
  '2-chronicles': { videos: ['HR7xaHv3Ias'], shared: 'The video covers 1 and 2 Chronicles.' },
  matthew: { videos: ['3Dv4-n6OYGI', 'GGCF3OPWN14'] },
  mark: { videos: ['HGHqu9-DtXk'] },
  john: { videos: ['G-2e9mMf7E8', 'RUfh_wOsauk'] },
  luke: { videos: ['XIb_dCIxzr0', '26z_KhwNdD8'] },
  acts: { videos: ['CGbNw855ksw', 'Z-17KxpjL0Q'] },
  romans: { videos: ['ej_6dVdJSIU', '0SVTl4Xa5fY'] },
  '1-corinthians': { videos: ['yiHf8klCCc4'] },
  '2-corinthians': { videos: ['3lfPK2vfC54'] },
  galatians: { videos: ['vmx4UjRFp0M'] },
  ephesians: { videos: ['Y71r-T98E2Q'] },
  philippians: { videos: ['oE9qqW1-BkU'] },
  colossians: { videos: ['pXTXlDxQsvc'] },
  '1-thessalonians': { videos: ['No7Nq6IX23c'] },
  '2-thessalonians': { videos: ['kbPBDKOn1cc'] },
  '1-timothy': { videos: ['7RoqnGcEjcs'] },
  '2-timothy': { videos: ['urlvnxCaL00'] },
  titus: { videos: ['PUEYCVXJM3k'] },
  philemon: { videos: ['aW9Q3Jt6Yvk'] },
  hebrews: { videos: ['1fNWTZZwgbs'] },
  james: { videos: ['qn-hLHWwRYY'] },
  '1-peter': { videos: ['WhP7AZQlzCg'] },
  '2-peter': { videos: ['wWLv_ITyKYc'] },
  '1-john': { videos: ['l3QkE6nKylM'], shared: 'The video covers 1, 2, and 3 John.' },
  '2-john': { videos: ['l3QkE6nKylM'], shared: 'The video covers 1, 2, and 3 John.' },
  '3-john': { videos: ['l3QkE6nKylM'], shared: 'The video covers 1, 2, and 3 John.' },
  jude: { videos: ['6UoCmakZmys'] },
  revelation: { videos: ['5nvVVcYD-0w', 'QpnIrbq2bKo'] },
}
