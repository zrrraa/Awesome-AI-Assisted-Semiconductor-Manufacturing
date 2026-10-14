"""Consistent Shields.io badges for the GitHub reading lists."""
import html
from urllib.parse import quote, urlencode

LOGOS = {'arXiv': 'arxiv', 'GitHub': 'github', 'GitLab': 'gitlab', 'Hugging Face': 'huggingface'}
COLORS = {'Paper': '526DAB', 'arXiv': 'B31B1B', 'GitHub': '181717', 'GitLab': 'FC6D26', 'Hugging Face': 'E8AD27', 'Dataset': '36875B', 'Project page': '526DAB', 'Citation': '7956AE', 'Reading guide': '36875B'}
GLYPHS = {'Paper': '↗', 'Project page': '↗', 'Dataset': '▦', 'Journal version': '↗', 'Conference version': '↗'}


def badge_text(value):
    # Shields uses underscores for spaces and doubled hyphens for literal hyphens.
    return quote(value.replace('_', '__').replace('-', '--'), safe='')


class Badges:
    def image(self, label, kind='resource', color='65558d', icon=None, title=None, year=None, venue_name=None):
        message = label
        leading = ''
        options = {'style': 'flat', 'labelColor': '575361'}
        if kind == 'venue' and year is not None:
            # Name and display year are resolved from the same venue metadata.
            if venue_name is None:
                raise ValueError('Venue badges require a separate venue name')
            leading = venue_name
            message = str(year)
            color = '74658C'
        elif kind in ('scope', 'stage') and ' ' in label:
            leading, message = label.split(' ', 1)
        elif kind == 'task':
            leading = 'Task'
        elif kind == 'resource':
            color = COLORS.get(icon, color)
            if icon in LOGOS:
                options.update(logo=LOGOS[icon], logoColor='white')
            elif icon in GLYPHS:
                leading = GLYPHS[icon]
        parts = [badge_text(leading), badge_text(message), color] if leading else [badge_text(message), color]
        url = 'https://img.shields.io/badge/'+'-'.join(parts)+'?'+urlencode(options)
        tooltip = ' title="'+html.escape(title,quote=True)+'"' if title else ''
        return '<img src="'+html.escape(url,quote=True)+'" alt="'+html.escape(label,quote=True)+'" height="20" align="absmiddle"'+tooltip+'>'

    def link(self, label, href, **kwargs):
        return '<a href="'+html.escape(href,quote=True)+'">'+self.image(label, **kwargs)+'</a>'
