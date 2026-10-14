"""Publication links must never change the research-trend population."""
import json
from pathlib import Path
import unittest
from unittest.mock import patch

from build_catalogue import ROOT, OUTPUT, build


def catalogue(outputs):
    return json.loads(outputs[OUTPUT].split(' = ', 1)[1].rstrip(';\n'))


class PublicationCountingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.outputs, _ = build()
        cls.data = catalogue(cls.outputs)

    def test_removing_relationships_leaves_statistics_unchanged(self):
        original_read = Path.read_text

        def read_without_history(path, *args, **kwargs):
            if path == ROOT / 'data/publication-history.json':
                return '{}'
            return original_read(path, *args, **kwargs)

        with patch.object(Path, 'read_text', read_without_history):
            unlinked, _ = build()
        for name in ['coverage.csv', 'timeline.csv']:
            path = ROOT / 'docs/assets' / name
            self.assertEqual(self.outputs[path], unlinked[path])
        self.assertEqual(self.data['studyCount'], catalogue(unlinked)['studyCount'])
        self.assertTrue(all(not p['relatedPublications'] for p in catalogue(unlinked)['papers']))

    def test_semclip_extension_is_linked_and_counted_separately(self):
        papers = {p['id']: p for p in self.data['papers']}
        for source, target in [('jin2024semclip', 'jin2026semclip2'),
                               ('jin2026semclip2', 'jin2024semclip')]:
            p = papers[source]
            self.assertTrue(p['isStudyRepresentative'])
            self.assertIsNone(p['countedWith'])
            self.assertIn(target, [r['id'] for r in p['relatedPublications']])

    def test_explicit_counting_markers_match_statistical_exclusions(self):
        selection = json.loads((ROOT / 'data/research-groups.json').read_text(encoding='utf-8'))
        marked = {p['id']: p['countedWith'] for p in self.data['papers'] if p['countedWith']}
        self.assertEqual(marked, selection['countedWith'])
        self.assertEqual(set(marked), {p['id'] for p in self.data['papers'] if not p['isStudyRepresentative']})
        for p in self.data['papers']:
            entry = self.outputs[ROOT / 'papers' / (p['scope'] + '.md')].split(
                '- <a id="' + p['id'] + '"></a>', 1)[1].split('\n- <a id=', 1)[0].split('\n## ', 1)[0]
            self.assertEqual('alt="Trends: Counted with ' in entry, bool(p['countedWith']))


if __name__ == '__main__':
    unittest.main()
