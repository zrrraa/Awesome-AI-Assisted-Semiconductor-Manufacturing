"""Build the public reading lists and bibliography with Python 3.10+ (no dependencies)."""
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit
from html import escape, unescape
from html.parser import HTMLParser
import argparse
import csv
import io
import json
import re

ROOT = Path(__file__).resolve().parents[1]

SCOPE_ICONS = {'A': '💠', 'P': '⚙️', 'E': '🔧', 'R': '🚚', 'F': '🏭'}
TASK_LABELS = {
    'A1': 'Wafer patterns', 'A2': 'Local defects', 'A3': 'Computational lithography',
    'A4': 'Quality & yield', 'A5': 'Yield diagnosis', 'A6': 'Adaptive inspection',
    'P1': 'Monitoring & endpoints', 'P2': 'Virtual metrology',
    'P3': 'Recipe optimization', 'P4': 'Feedback control',
    'E1': 'Fault diagnosis', 'E2': 'Prognostics & maintenance',
    'E3': 'Calibration & qualification',
    'R1': 'Cycle time & delivery', 'R2': 'Scheduling & dispatching',
    'R3': 'Material handling', 'R4': 'Bottlenecks',
    'F1': 'Utilities & resources', 'F2': 'Capacity planning',
}


def read_json(name):
    return json.loads((ROOT / 'data' / name).read_text(encoding='utf-8'))


def md(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('|', '&#124;').replace('[', r'\[').replace(']', r'\]')


def link(url):
    return quote(url, safe=':/?=&%#@+~,;!-._')


def tex(text):
    return ''.join({'&': r'\&', '%': r'\%', '_': r'\_', '#': r'\#'}.get(c, c) for c in text)


def scope_row(scope):
    target = f"papers/{scope['slug']}.md"
    task_links = [
        f'<a href="{target}#{t["id"].lower()}">{t["id"]} {escape(TASK_LABELS.get(t["id"], t["title"]))}</a>'
        for t in scope['tasks']
    ]
    rows = [' &nbsp; · &nbsp; '.join(task_links[i:i + 2]) for i in range(0, len(task_links), 2)]
    return '\n'.join([
        '<tr>',
        f'<td valign="top"><b><a href="{target}">{SCOPE_ICONS[scope["id"]]} {escape(scope["title"])}</a></b></td>',
        '<td>' + '<br>\n'.join(rows) + '</td>',
        '</tr>',
    ])


def build():
    papers, scopes, survey, resources = (read_json(f) for f in ['papers.json', 'taxonomy.json', 'survey.json', 'resources.json'])
    tasks = {t['id']: t for scope in scopes for t in scope['tasks']}
    scope_for_task = {t['id']: scope for scope in scopes for t in scope['tasks']}
    ids, dois = set(), set()
    for p in papers:
        assert re.fullmatch(r'[a-zA-Z0-9_-]+', p['id']), p['id']
        assert p['id'] not in ids, f"Duplicate paper: {p['id']}"
        ids.add(p['id'])
        assert p['task'] in tasks, f"Unknown task: {p['task']}"
        assert isinstance(p['year'], int) and 1900 <= p['year'] <= 2100
        assert all(p[x].strip() for x in ['title', 'authors', 'venue', 'publication_type', 'url'])
        assert urlsplit(p['url']).scheme in ['https', 'http'] and urlsplit(p['url']).netloc
        if p['doi']:
            normalized = p['doi'].lower()
            assert normalized not in dois, f"Duplicate DOI: {p['doi']}"
            assert re.fullmatch(r'10\.\d{4,9}/\S+', p['doi']), p['doi']
            dois.add(normalized)
        assert p['bibtex_type'] in ['article', 'inproceedings', 'misc', 'techreport', 'incollection']
    assert set(survey['survey_baseline_ids']) <= ids, 'A survey baseline record is missing.'
    resource_ids = set()
    for resource in resources:
        assert resource['id'] not in resource_ids
        resource_ids.add(resource['id'])
        assert all(t in tasks for t in resource['tasks'])
        assert all(i in ids for i in resource['paper_ids'])
        assert urlsplit(resource['url']).scheme in ['https', 'http']
    outputs = {}
    task_rows = []
    for scope in scopes:
        target = f"papers/{scope['slug']}.md"
        task_rows.append(scope_row(scope))
        scope_nav = ' &nbsp; / &nbsp; '.join(
            f'<b>{s["title"]}</b>' if s == scope else f'<a href="{s["slug"]}.md">{s["title"]}</a>'
            for s in scopes
        )
        lines = [
            f'# {SCOPE_ICONS[scope["id"]]} {scope["title"]}', '',
            '[← Home](../README.md) · [Datasets & code](../RESOURCES.md) · [BibTeX](../references.bib)', '',
            f'<p>{scope_nav}</p>', '',
            scope['description'], '',
            'Papers are listed newest first within each task.', '',
            '## In this collection', '',
        ]
        for t in scope['tasks']:
            lines.append(f"- [{t['id']} · {t['title']}](#{t['id'].lower()})")
        for t in scope['tasks']:
            lines += ['', f'<a id="{t["id"].lower()}"></a>', '', f"## {t['id']} · {t['title']}", '', f'> {t["question"]}', '']
            for p in sorted((p for p in papers if p['task'] == t['id']), key=lambda p: (-p['year'], p['title'].casefold())):
                names = p['authors'].split(' and ')
                authors = ', '.join(n.split(',')[0] for n in names[:2]) if len(names) <= 2 else names[0].split(',')[0] + ' et al.'
                extra = ' · **Preprint**' if p['publication_type'] == 'Preprint' else ''
                related = [x for x in resources if p['id'] in x['paper_ids']]
                extra += ''.join(f" · [{md(x['name'])}]({link(x['url'])})" for x in related if x['url'] != p['url'])
                lines += [f'- <a id="{p["id"]}"></a>**[{md(p["title"])}]({link(p["url"])})**<br>',
                          f'  {p["year"]} · {md(authors).rstrip(".")}. · *{md(p["venue"])}*{extra}', '']
            lines += ['[↑ Task index](#in-this-collection)', '']
        lines += ['---', '', '[← All manufacturing scopes](../README.md#browse-by-manufacturing-task) · [Suggest a paper](../CONTRIBUTING.md)', '']
        outputs[target] = '\n'.join(lines).rstrip() + '\n'
    task_table = ['<table>', '<tr><th align="left">Scope</th><th align="left">Tasks</th></tr>', *task_rows, '</table>']
    resources_md = [
        '# 🧰 Datasets & code', '',
        '[← Home](README.md) · [Paper collection](README.md#browse-by-manufacturing-task) · [Reading guide](docs/getting-started.md)', '',
        'Public datasets, benchmarks and implementations for hands-on work. Each entry links to its project or dataset paper.', '',
        '[Wafer patterns](#wafer-patterns) &nbsp; / &nbsp; [Image defects](#image-defects) &nbsp; / &nbsp; [Lithography](#lithography) &nbsp; / &nbsp; [Quality prediction](#quality-prediction) &nbsp; / &nbsp; [Scheduling](#scheduling)', '',
    ]
    resource_groups = [('Wafer patterns', ['A1']), ('Image defects', ['A2']), ('Lithography', ['A3']),
                       ('Quality prediction', ['A4']), ('Scheduling', ['R2'])]
    grouped = set()
    for title, group_tasks in resource_groups + [('More resources', list(tasks))]:
        group = [x for x in resources if set(x['tasks']) & set(group_tasks) and x['id'] not in grouped]
        if not group:
            continue
        resources_md += [f'## {title}', '']
        for x in group:
            grouped.add(x['id'])
            ts = ' · '.join(f"[{t} · {md(tasks[t]['title'])}](papers/{scope_for_task[t]['slug']}.md#{t.lower()})" for t in x['tasks'])
            resources_md += [f'<a id="{x["id"]}"></a>', '', f'### [{md(x["name"])}]({link(x["url"])})',
                             '', md(x['description']), '', ts, '']
    resources_md += ['', '## Choosing an evaluation', '', 'Match the evaluation to the decision you want to support. For wafer maps, record which patterns and label definitions are used. For lithography, report the layout set, lithography model and optimization objective. For scheduling, specify the factory configuration, product mix and dispatching rules. These choices determine what a result means.', '', 'Resource descriptions were checked against their project or publisher pages on ' + survey['updated'] + '. New resources and corrected links are welcome through [an issue](https://github.com/zrrraa/Awesome-AI-Assisted-Semiconductor-Manufacturing/issues/new/choose) or a pull request.', '']
    outputs['RESOURCES.md'] = '\n'.join(resources_md)
    header = ['id', 'title', 'authors', 'year', 'venue', 'publication_type', 'doi', 'url', 'task']
    csvout = io.StringIO(newline='')
    writer = csv.DictWriter(csvout, fieldnames=header, lineterminator='\n', extrasaction='ignore')
    writer.writeheader()
    writer.writerows(sorted(papers, key=lambda p: (p['task'], -p['year'], p['id'])))
    outputs['data/papers.csv'] = csvout.getvalue()
    bib = []
    for p in sorted(papers, key=lambda p: p['id']):
        venue_field = ('booktitle' if p['bibtex_type'] in ['inproceedings', 'incollection']
                       else 'howpublished' if p['bibtex_type'] == 'misc' else 'journal')
        fields = {'author': tex(p['authors']), 'title': '{' + tex(p['title']) + '}', 'year': str(p['year']), venue_field: tex(p['venue']), **p['bibtex_extra']}
        if p['doi']:
            fields['doi'] = p['doi']
        fields['url'] = p['url']
        bib += [f"@{p['bibtex_type']}{{{p['id']},"] + [f'  {k} = {{{v}}},' for k, v in fields.items()] + ['}', '']
    outputs['references.bib'] = '\n'.join(bib)
    readme = (ROOT / 'README.md').read_text(encoding='utf-8')
    citation_doc = (ROOT / 'docs/citation.md').read_text(encoding='utf-8')
    fence = chr(96) * 3
    citation = re.search(fence + r'bibtex\n(.*?)\n' + fence, citation_doc, re.S)
    assert citation, 'Survey BibTeX is missing from docs/citation.md.'
    blocks = {'CITATION': fence + 'bibtex\n' + citation.group(1) + '\n' + fence, 'TASKS': '\n'.join(task_table)}
    for name, content in blocks.items():
        pattern = f'<!-- BEGIN {name} -->.*?<!-- END {name} -->'
        assert len(re.findall(pattern, readme, re.S)) == 1, name
        readme = re.sub(pattern, lambda _: f'<!-- BEGIN {name} -->\n{content}\n<!-- END {name} -->', readme, flags=re.S)
    outputs['README.md'] = readme
    return outputs, len(papers), len(tasks)


class HTMLLinks(HTMLParser):
    """Include HTML image sources and navigation in the local-link check."""

    def __init__(self, content):
        super().__init__()
        self.links = []
        self.anchors = set()
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if value and name in ['href', 'src']:
                self.links.append(value)
            elif value and name == 'id':
                self.anchors.add(value)


def check_links(outputs):
    documents = {p.relative_to(ROOT).as_posix(): p.read_text(encoding='utf-8') for p in ROOT.rglob('*.md') if '.git' not in p.parts}
    documents.update({k: v for k, v in outputs.items() if k.endswith('.md')})
    for name, content in documents.items():
        html = HTMLLinks(content)
        for raw in re.findall(r'\]\(([^\s)]+)\)', content) + html.links:
            raw = unescape(raw)
            if urlsplit(raw).scheme or raw.startswith('//'):
                continue
            path, _, anchor = unquote(raw).partition('#')
            target = (ROOT / name).parent / path if path else ROOT / name
            assert target.resolve().is_relative_to(ROOT), f'Outside repository: {raw}'
            rel = target.resolve().relative_to(ROOT).as_posix()
            assert rel in outputs or target.exists(), f'{name}: broken local link {raw}'
            if anchor and rel in documents:
                doc = documents[rel]
                anchors = HTMLLinks(doc).anchors
                for title in re.findall(r'^#+\s+(.+)$', doc, re.M):
                    anchors.add(re.sub(r'[^\w\- ]', '', title.lower()).replace(' ', '-'))
                assert anchor in anchors, f'{name}: missing anchor {raw}'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Check data, local links and generated files without writing.')
    args = parser.parse_args()
    outputs, papers, tasks = build()
    check_links(outputs)
    changed = []
    for name, content in outputs.items():
        path = ROOT / name
        if not path.exists() or path.read_text(encoding='utf-8') != content:
            changed.append(name)
            if not args.check:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding='utf-8', newline='\n')
    if args.check and changed:
        raise SystemExit('Generated files need updating: ' + ', '.join(changed))
    print(f'{papers} papers; {tasks} tasks; data and local links valid; {len(changed)} files updated.' if not args.check else f'{papers} papers; {tasks} tasks; catalogue and generated files are consistent.')


if __name__ == '__main__':
    main()
