"""Bibliography names, venue labels and independently verified resource links."""
import html
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def text(value):
    for _ in range(3):
        value = html.unescape(value)
    accents = {"'": '\u0301', '`': '\u0300', '"': '\u0308', '^': '\u0302',
               '~': '\u0303', '=': '\u0304', 'v': '\u030c', 'c': '\u0327',
               'u': '\u0306', 'H': '\u030b', '.': '\u0307'}
    value = re.sub(r'\\([\'`"^~=vcuH.])\s*\{?([A-Za-z])\}?',
                   lambda m: unicodedata.normalize('NFC', m[2]+accents[m[1]]), value)
    for command, char in [('ss','ß'),('ae','æ'),('AE','Æ'),('oe','œ'),('OE','Œ'),('o','ø'),('O','Ø'),('l','ł'),('L','Ł'),('i','ı')]:
        value = re.sub(r'\\'+command+r'\b\s*',char,value)
    return re.sub(r'\s+', ' ', value.replace('\\&','&').replace('\\_','_').replace('\\%','%').replace('{','').replace('}','')).strip()


def bibliography():
    raw=(ROOT/'references.bib').read_text(encoding='utf-8')
    records={}
    starts=list(re.finditer(r'^@(\w+)\{([^,]+),',raw,re.M))
    for n, match in enumerate(starts):
        entry=raw[match.end(): starts[n+1].start() if n+1<len(starts) else len(raw)]
        fields={'type':match[1]}
        for field in re.finditer(r'^\s*(\w+)\s*=\s*\{',entry,re.M):
            i=field.end(); start=i; depth=1
            while i<len(entry) and depth:
                if i==0 or entry[i-1]!='\\':
                    if entry[i]=='{': depth+=1
                    elif entry[i]=='}': depth-=1
                i+=1
            if depth: raise ValueError('Unbalanced bibliography field: '+match[2])
            fields[field[1]]=entry[start:i-1]
        records[match[2]]=fields
    return records


def author_names(raw):
    names=[]
    for author in re.split(r'\s+and\s+',raw):
        bits=[text(v) for v in author.split(',')]
        if len(bits)==2: names.append(bits[1]+' '+bits[0])
        elif len(bits)==3: names.append(bits[2]+' '+bits[0]+', '+bits[1])
        else: names.append(text(author))
    return names


VENUES={
 'IEEE Transactions on Semiconductor Manufacturing':'IEEE TSM',
 'IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems':'IEEE TCAD',
 'IEEE Transactions on Automation Science and Engineering':'IEEE TASE',
 'IEEE Transactions on Industrial Informatics':'IEEE TII',
 'IEEE Transactions on Circuits and Systems I: Regular Papers':'IEEE TCAS-I',
 'IEEE Transactions on Cybernetics':'IEEE TCYB',
 'ACM Transactions on Design Automation of Electronic Systems':'ACM TODAES',
 'International Journal of Production Research':'IJPR',
 'International Journal of Production Economics':'IJPE',
 'Journal of Intelligent Manufacturing':'JIM',
 'Journal of Manufacturing Systems':'JMS',
 'Computers & Industrial Engineering':'CAIE',
 'Computers & Operations Research':'COR',
 'Expert Systems with Applications':'ESWA',
 'Engineering Applications of Artificial Intelligence':'EAAI',
 'The International Journal of Advanced Manufacturing Technology':'IJAMT',
 'Journal of Process Control':'JPC',
 'Applied Soft Computing':'ASC',
 'Advanced Engineering Informatics':'AEI',
 'Journal of Micro/Nanopatterning, Materials, and Metrology':'JM3',
 'Journal of Micro/Nanolithography, MEMS, and MOEMS':'JM3',
 'International Journal of Prognostics and Health Management':'IJPHM',
 'Neural Computing and Applications':'NCA',
 'IEEE/ASME Transactions on Mechatronics':'IEEE TMECH',
 'Quality and Reliability Engineering International':'QREI',
 'Journal of Industrial Information Integration':'JIII',
 'European Journal of Operational Research':'EJOR',
 'Journal of Computational Design and Engineering':'JCDE',
 'Scientific Reports':'Sci. Rep.',
 'Microscopy and Microanalysis':'Microsc. Microanal.',
 'Materials Science in Semiconductor Processing':'MSSP',
 'IEEE Transactions on Device and Materials Reliability':'IEEE TDMR',
 'EURASIP Journal on Image and Video Processing':'EURASIP JIVP',
 'International Journal of Distributed Sensor Networks':'IJDSN',
 'International Journal of Control Science and Engineering':'IJCSE',
 'International Journal of Engineering and Manufacturing':'IJEM',
 'Proceedings of the Institution of Mechanical Engineers, Part O: Journal of Risk and Reliability':'J. Risk Reliab.',
 'Journal of King Saud University Computer and Information Sciences':'JKSUCIS',
 'ICCK Transactions on Emerging Topics in Artificial Intelligence':'TETAI',
 'JSTS:Journal of Semiconductor Technology and Science':'JSTS',
 'IEEE Internet of Things Journal':'IEEE IoT-J',
}


def venue_badge(venue,year):
    venue=text(venue)
    if venue.lower() in ('arxiv','preprint',''): return str(year)
    # A proceedings volume can appear after the conference itself (e.g. ECCV 2024).
    edition = re.search(r'\b((?:19|20)\d{2})\b',venue)
    badge_year = edition[1] if edition else str(year)
    aliases=[('Asia and South Pacific Design Automation','ASP-DAC'),
             ('International Conference on Machine Learning','ICML'),
             ('Neural Information Processing Systems','NeurIPS'),
             ('Winter Simulation Conference','WSC'),('Design Automation Conference','DAC'),
             ('Conference on Computer-Aided Design','ICCAD'),('Conference on Computer Aided Design','ICCAD'),
             ('AAAI Conference','AAAI'),('Advanced Semiconductor Manufacturing Conference','ASMC'),
             ('Computer Vision – ECCV','ECCV-W'),('Annual Conference of the PHM Society','PHM'),
             ('PHM Society Asia-Pacific','PHMAP'),('Metrology, Inspection, and Process Control','SPIE MIPC'),
             ('DTCO and Computational Patterning','SPIE DTCO'),('Photomask Technology','SPIE Photomask'),
             ('Design-Process-Technology Co-optimization','SPIE DTCO')]
    name=VENUES.get(venue)
    if not name:
        name=next((alias for substring,alias in aliases if substring.lower() in venue.lower()),None)
    if not name:
        match=re.search(r'\(([A-Z][A-Za-z0-9-]{1,9})(?: \d{4})?\)',venue)
        name=match[1] if match else venue
    name=re.sub(r'\s+20\d\d\b','',name)
    return name+badge_year[-2:]


def enrichment():
    path=ROOT/'data/paper-resources.json'
    return json.loads(path.read_text(encoding='utf-8'))['papers'] if path.exists() else {}
