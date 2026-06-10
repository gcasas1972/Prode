#!/usr/bin/env python3
# Minimal PDF generator: reads a markdown file and writes plain-text PDF without external libs.
import sys
import os

INPUT = 'docs/PRODE_Docker_Guide.md'
OUTPUT = 'docs/PRODE_Docker_Guide.pdf'
PAGE_WIDTH = 595
PAGE_HEIGHT = 842
MARGIN_LEFT = 40
MARGIN_TOP = 800
LINE_HEIGHT = 12
MAX_LINES = int((PAGE_HEIGHT - 80) / LINE_HEIGHT)

def escape_pdf_text(s):
    return s.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

with open(INPUT, 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

# Wrap long lines
wrapped = []
max_chars = 80
for line in lines:
    if not line:
        wrapped.append('')
        continue
    # naive wrap
    while len(line) > max_chars:
        part = line[:max_chars]
        # try break at last space
        idx = part.rfind(' ')
        if idx > 10:
            wrapped.append(line[:idx])
            line = line[idx+1:]
        else:
            wrapped.append(part)
            line = line[max_chars:]
    wrapped.append(line)

# Build content stream
text_objects = []
y = MARGIN_TOP
for l in wrapped:
    if y < 40:
        # only one page supported by this simple generator
        break
    esc = escape_pdf_text(l)
    text_objects.append(f'BT /F1 10 Tf {MARGIN_LEFT} {y} Td ({esc}) Tj ET')
    y -= LINE_HEIGHT

content = '\n'.join(text_objects) + '\n'
content_bytes = content.encode('utf-8')

# Build PDF objects
objects = []
# obj 1: Catalog
objects.append(b'1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')
# obj 2: Pages
objects.append(b'2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n')
# obj 3: Page
objects.append(b'3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 %d %d] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents 4 0 R >>\nendobj\n' % (PAGE_WIDTH, PAGE_HEIGHT))
# obj 4: Content stream
obj4 = b'4 0 obj\n<< /Length %d >>\nstream\n' % (len(content_bytes))
obj4 += content_bytes
obj4 += b'endstream\nendobj\n'
objects.append(obj4)

# Write file with xref
with open(OUTPUT, 'wb') as f:
    f.write(b'%PDF-1.4\n')
    offsets = []
    for obj in objects:
        offsets.append(f.tell())
        f.write(obj)
    xref_pos = f.tell()
    f.write(b'xref\n')
    f.write(b'0 %d\n' % (len(objects) + 1))
    f.write(b'0000000000 65535 f \n')
    for off in offsets:
        f.write(b'%010d 00000 n \n' % off)
    f.write(b'trailer\n')
    f.write(b'<< /Size %d /Root 1 0 R >>\n' % (len(objects) + 1))
    f.write(b'startxref\n')
    f.write(b'%d\n' % xref_pos)
    f.write(b'%%EOF\n')

print('PDF generado en', OUTPUT)
