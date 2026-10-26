from pathlib import Path
from pypdf import PdfReader
root = Path(__file__).resolve().parent.parent
out = root / 'work' / 'reference-text'
out.mkdir(parents=True, exist_ok=True)
for source in (root / 'ref_docs').glob('*.pdf'):
    reader = PdfReader(str(source))
    text = '\n'.join(f'\n--- PDF PAGE {i+1} ---\n' + (p.extract_text() or '') for i,p in enumerate(reader.pages))
    (out / (source.stem + '.txt')).write_text(text, encoding='utf-8')
    print(source.name, len(reader.pages), 'pages')
