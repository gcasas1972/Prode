#!/usr/bin/env python3
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm

import sys

INPUT = 'docs/PRODE_Docker_Guide.md'
OUTPUT = 'docs/PRODE_Docker_Guide.pdf'

def main():
    try:
        with open(INPUT, 'r', encoding='utf-8') as f:
            text = f.read()
    except Exception as e:
        print('Error leyendo', INPUT, e)
        sys.exit(1)

    doc = SimpleDocTemplate(OUTPUT, pagesize=A4,
                            rightMargin=20*mm, leftMargin=20*mm,
                            topMargin=20*mm, bottomMargin=20*mm)

    styles = getSampleStyleSheet()
    normal = styles['Normal']
    heading = ParagraphStyle('Heading', parent=styles['Heading1'], spaceAfter=6)
    code_style = ParagraphStyle('Code', fontName='Courier', fontSize=9, leading=12)

    elements = []

    parts = text.split('\n\n')
    in_code = False
    code_block = []

    for part in parts:
        if part.strip().startswith('```'):
            # toggle code block
            if not in_code:
                in_code = True
                code_block = []
                # if there's language after backticks, ignore
                if part.strip() != '```':
                    code_block.append('\n'.join(part.split('\n')[1:]))
            else:
                in_code = False
                elements.append(Preformatted('\n'.join(code_block), code_style))
        elif in_code:
            code_block.append(part)
        else:
            # treat as normal paragraph, but preserve lines starting with # as headings
            lines = part.strip().split('\n')
            if lines and lines[0].startswith('#'):
                # heading level by # count
                level = len(lines[0]) - len(lines[0].lstrip('#'))
                text = lines[0].lstrip('#').strip()
                elements.append(Paragraph(text, styles['Heading%d' % min(3, level)]))
                rest = '\n'.join(lines[1:]).strip()
                if rest:
                    elements.append(Paragraph(rest.replace('\n', '<br/>'), normal))
            else:
                elements.append(Paragraph(part.replace('\n', '<br/>'), normal))
        elements.append(Spacer(1,6))

    doc.build(elements)
    print('PDF generado en', OUTPUT)

if __name__ == '__main__':
    main()
