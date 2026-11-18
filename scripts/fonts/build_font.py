# A record of how the designer made the font files in src/fonts/ on 2026-11-17.
# The build of the site does not run this script.
# Section 16.3 of docs/DESIGN.md gives the source file and its SHA-256.

"""Build the static web font files of the site from the Inrond variable font.

Input: the Inrond 1.0 variable font Inrond[ROND,opsz,wght].ttf, and the files folder of
@fontsource/inter 5.3.0.
For each weight: fix the axes at ROND 20 and opsz 14. Then cut the font to the same characters
and the same layout features as the matching latin and latin-ext file of @fontsource/inter 5.3.0,
and save it as woff2.

Usage: python3 build_font.py <Inrond[ROND,opsz,wght].ttf> <@fontsource/inter/files> <output folder> <family name>
Needs: fontTools 4.x and brotli.
"""
import copy
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

ROND = 20
OPSZ = 14
WEIGHTS = {300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold'}

# The layout features that the files of @fontsource/inter 5.3.0 keep.
FEATURES = ['calt', 'ccmp', 'dnom', 'frac', 'locl', 'numr', 'pnum', 'tnum', 'kern', 'mark', 'mkmk']

# The unicode-range values of @fontsource/inter 5.3.0, file 800.css.
RANGES = {
    'latin': 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,'
             'U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
    'latin-ext': 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,'
                 'U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
}


def codepoints(spec):
    out = []
    for part in spec.split(','):
        part = part.strip()[2:]
        if '-' in part:
            a, b = part.split('-')
            out.extend(range(int(a, 16), int(b, 16) + 1))
        else:
            out.append(int(part, 16))
    return out


def rename(font, family, style_name):
    """Give the font its own name. OFL 1.1 lets a changed copy keep or change its name; the site uses its own."""
    name = font['name']
    full = f'{family} {style_name}'
    ps = f"{family.replace(' ', '')}-{style_name}"
    for rec in list(name.names):
        if rec.nameID in (1, 2, 3, 4, 6, 16, 17, 25):
            name.removeNames(nameID=rec.nameID)
    name.setName(family, 1, 3, 1, 0x409)
    name.setName('Regular', 2, 3, 1, 0x409)
    name.setName(f'1.000;{ps}', 3, 3, 1, 0x409)
    name.setName(full, 4, 3, 1, 0x409)
    name.setName(ps, 6, 3, 1, 0x409)
    name.setName(family, 16, 3, 1, 0x409)
    name.setName(style_name, 17, 3, 1, 0x409)
    old5 = name.getDebugName(5) or ''
    name.setName(f'{old5}; Inrond 1.0 with ROND {ROND} and opsz {OPSZ}, cut to latin and latin-ext', 5, 3, 1, 0x409)


def main():
    src, fsdir, outdir, family = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3]), sys.argv[4]
    outdir.mkdir(parents=True, exist_ok=True)
    slug = family.lower().replace(' ', '-')
    for wght, style_name in WEIGHTS.items():
        static = instantiateVariableFont(TTFont(src), {'wght': wght, 'opsz': OPSZ, 'ROND': ROND})
        rename(static, family, style_name)
        static['OS/2'].usWeightClass = wght
        for subset_name, spec in RANGES.items():
            opts = subset.Options()
            opts.flavor = 'woff2'
            opts.layout_features = FEATURES
            opts.name_IDs = ['*']
            opts.name_languages = ['*']
            opts.notdef_outline = True
            opts.glyph_names = False
            opts.hinting = False
            sub = subset.Subsetter(opts)
            font = copy.deepcopy(static)  # the subsetter changes the font in place
            # The same characters as the Inter file of the same subset and weight.
            inter = TTFont(fsdir / f'inter-{subset_name}-{wght}-normal.woff2')
            unicodes = sorted(inter.getBestCmap())
            sub.populate(unicodes=unicodes)
            sub.subset(font)
            font.flavor = 'woff2'
            path = outdir / f'{slug}-{subset_name}-{wght}-normal.woff2'
            font.save(path)
            print(path.name, path.stat().st_size)


if __name__ == '__main__':
    main()
