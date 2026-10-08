"""Check the public Markdown reading lists, bibliography and local links."""
from collections import Counter
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]


class HTMLReferences(HTMLParser):
    def __init__(self, content):
        super().__init__()
        self.links = []
        self.anchors = set()
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if value and name in ('href', 'src'):
                self.links.append(value)
            if value and name == 'id':
                self.anchors.add(value)


def main():
    # Ignored local archives are deliberately outside the public checks.
    listing = subprocess.check_output(
        ['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'],
        cwd=ROOT,
    ).decode('utf-8')
    files = {name for name in listing.split('\0') if name}
    documents = {name: (ROOT / name).read_text(encoding='utf-8')
                 for name in files if name.endswith('.md')}
    errors = []
    for name, content in documents.items():
        links = re.findall(r'\]\(([^\s)]+)\)', content) + HTMLReferences(content).links
        for raw in links:
            parts = urlsplit(unescape(raw))
            if parts.scheme or parts.netloc:
                continue
            target = ((ROOT / name).parent / unquote(parts.path)).resolve() if parts.path else ROOT / name
            if not target.is_relative_to(ROOT):
                errors.append(f'{name}: link outside repository: {raw}')
                continue
            relative = target.relative_to(ROOT).as_posix()
            if relative not in files:
                errors.append(f'{name}: missing public file: {raw}')
                continue
            if parts.fragment and relative in documents:
                text = documents[relative]
                anchors = HTMLReferences(text).anchors
                for title in re.findall(r'^#+\s+(.+)$', text, re.M):
                    anchors.add(re.sub(r'[^\w\- ]', '', title.lower()).replace(' ', '-'))
                if unquote(parts.fragment) not in anchors:
                    errors.append(f'{name}: missing anchor: {raw}')

    entries = []
    for name, content in documents.items():
        if name.startswith('papers/'):
            ids = re.findall(r'^- <a id="([a-zA-Z0-9_-]+)"></a>\*\*\[', content, re.M)
            if not ids:
                errors.append(f'{name}: no paper entries found')
            entries.extend(ids)
    bibliography = (ROOT / 'references.bib').read_text(encoding='utf-8')
    keys = re.findall(r'^@\w+\{([^,\s]+),', bibliography, re.M)
    for label, values in [('paper', entries), ('BibTeX key', keys)]:
        for key, count in Counter(values).items():
            if count > 1:
                errors.append(f'Duplicate {label}: {key}')
    missing = set(entries) - set(keys)
    unlisted = set(keys) - set(entries)
    if missing:
        errors.append('Missing BibTeX: ' + ', '.join(sorted(missing)))
    if unlisted:
        errors.append('Missing paper entries: ' + ', '.join(sorted(unlisted)))
    dois = re.findall(r'^\s+doi\s*=\s*\{([^}]+)\}', bibliography, re.M)
    for doi, count in Counter(value.lower() for value in dois).items():
        if count > 1:
            errors.append(f'Duplicate DOI: {doi}')
    if errors:
        raise SystemExit('\n'.join(errors))
    print('Public links, paper entries and bibliography are consistent.')


if __name__ == '__main__':
    main()
