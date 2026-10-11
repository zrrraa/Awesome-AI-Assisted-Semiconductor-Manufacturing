"""Small local SVG badges shared by the GitHub reading lists.

The SVGs are generated with the catalogue, so they need no external badge service.
"""
import hashlib
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIRECTORY = ROOT / 'docs/assets/badges'
ICONS = {
    'Paper': 'M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6',
    'arXiv': 'm5 4 14 16 M8 4l11 12 M5 20l5-6 M14 10l5-6',
    'GitHub': 'M9 19c-4.3 1.3-4.3-2.2-6-2.6 M15 22v-3.4c0-1 .1-1.5-.5-2.1 3-.3 6.1-1.5 6.1-6.8a5.3 5.3 0 0 0-1.4-3.7 4.8 4.8 0 0 0-.1-3.6s-1.1-.4-3.7 1.4a12.5 12.5 0 0 0-6.8 0C6 2 4.9 2.4 4.9 2.4A4.8 4.8 0 0 0 4.8 6a5.3 5.3 0 0 0-1.4 3.7c0 5.3 3.1 6.5 6.1 6.8-.5.5-.6 1.1-.5 2.1V22',
    'GitLab': 'm12 21-9-7 2-11 4 8h6l4-8 2 11z M3 14l6-3 3 10 3-10 6 3',
    'Project page': 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3c-5 6-5 12 0 18 5-6 5-12 0-18',
    'Hugging Face': 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M8 9h.1 M16 9h.1 M8 14q4 5 8 0',
    'Dataset': 'M4 6c0-4 16-4 16 0s-16 4-16 0v12c0 4 16 4 16 0V6 M4 12c0 4 16 4 16 0',
    'Citation': 'M5 5h14v14H5z M8 9h8 M8 12h8 M8 15h5',
    'Reading guide': 'M12 5C8 2 4 3 2 4v15c3-2 7-2 10 0 3-2 7-2 10 0V4c-3-2-7-2-10 1v14',
}


def text_width(label):
    return sum(3.3 if c in 'ilI.,:;!| ' else 10.5 if c in 'MW@' else 8 if c.isupper() else 6.5 for c in label)


class Badges:
    def __init__(self):
        self.outputs = {}

    def image(self, label, kind='resource', color='65558d', icon=None, prefix='../docs/assets/badges/', title=None):
        slug = re.sub(r'[^a-z0-9]+', '-', label.lower()).strip('-')
        filename = kind+'-'+slug[:76]+'-'+hashlib.sha1((label+color).encode()).hexdigest()[:6]+'.svg'
        escaped = html.escape(label)
        icon_path = ICONS.get(icon)
        x = 28 if icon_path else 10
        width = round(text_width(label)+x+10)
        fill = {'venue':'f1edf6', 'scope':'f0edf7', 'stage':'edf3f7', 'task':'f4f1e9'}.get(kind,'f7f8fa')
        drawing = f'<g transform="translate(7 5) scale(.58)" fill="none" stroke="#{color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="{icon_path}"/></g>' if icon_path else ''
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="24" viewBox="0 0 {width} 24" role="img" aria-label="{escaped}"><title>{escaped}</title><rect x=".5" y=".5" width="{width-1}" height="23" rx="5" fill="#{fill}" stroke="#{color}" stroke-opacity=".24"/>{drawing}<text x="{x}" y="16" font-family="Arial,Helvetica,sans-serif" font-size="11" font-weight="600" fill="#{color}">{escaped}</text></svg>\n'
        self.outputs[DIRECTORY/filename] = svg
        tooltip = ' title="'+html.escape(title,quote=True)+'"' if title else ''
        return f'<img src="{prefix+filename}" alt="{escaped}" height="24"{tooltip}>'

    def link(self, label, href, **kwargs):
        return '<a href="'+html.escape(href,quote=True)+'">'+self.image(label, **kwargs)+'</a>'
