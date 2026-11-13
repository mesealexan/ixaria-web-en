"""Subset the existing Inter fonts without changing glyph outlines or hinting.

Requires fonttools and brotli. Run after adding copy with new Unicode characters.
"""
import argparse
import hashlib
import json
from pathlib import Path
import sys

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--dependency-path', help='Optional directory with Python dependencies')
args = parser.parse_args()
if args.dependency_path:
    sys.path.insert(0, str(Path(args.dependency_path).resolve()))

from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
characters = set(range(32, 127))
for path in (root / 'src').rglob('*'):
    if path.suffix in {'.astro', '.ts', '.json', '.md', '.css'} and path.name != 'font-subsets.json':
        characters.update(map(ord, path.read_text(encoding='utf-8')))

manifest = []
for source, name in [('inter-0.woff2', 'inter-latin-ext'), ('inter-1.woff2', 'inter-latin')]:
    font = TTFont(root / 'public/fonts' / source, recalcTimestamp=False)
    required = sorted(characters.intersection(font.getBestCmap()))
    options = subset.Options()
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_languages = ['*']
    options.name_legacy = True
    options.recalc_timestamp = False
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=required)
    subsetter.subset(font)
    assert set(required).issubset(font.getBestCmap()), 'A required character was lost'
    destination = root / 'public/fonts' / f'{name}-subset.woff2'
    font.save(destination)
    digest = hashlib.sha256(destination.read_bytes()).hexdigest()[:12]
    versioned = destination.with_name(f'{name}-{digest}.woff2')
    destination.replace(versioned)
    manifest.append({'source': f'/fonts/{source}', 'url': f'/fonts/{versioned.name}',
                     'bytes': versioned.stat().st_size, 'codepoints': required})

(root / 'src/data/font-subsets.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
for item in manifest:
    print(f"{item['url']}: {item['bytes']} bytes, {len(item['codepoints'])} characters")
