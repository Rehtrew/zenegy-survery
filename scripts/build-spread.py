#!/usr/bin/env python3
"""
Two inside pages of the fictive report, for mockups of the open magazine.

    npm run gen:spread

Writes design/spread-left.svg and design/spread-right.svg (A4, same canvas as
the cover) and renders each to PNG with rsvg-convert. The numbers are the
preliminary survey results as of the date in FOOTNOTE; update them here and
rebuild when the survey closes.

Brand rule: PP Neue Montreal in the Medium weight only. Hierarchy comes from
size and colour, never weight.
"""
import os
import subprocess
from xml.sax.saxutils import escape

ROOT = os.path.join(os.path.dirname(__file__), '..')
W, H = 2100, 2970
FONT = "font-family=\"'PP Neue Montreal', sans-serif\" font-weight=\"500\""

INK, INK2, INK3 = '#14132b', '#55546a', '#8b88a5'
BRAND, BRAND_SOFT, BRAND_PALE = '#6e30fd', '#efeafe', '#d9ccfd'
GROUND = '#f3f2f7'

REPORT = 'Lønmarkedsrapporten 2026'


def text(x, y, s, size, fill, anchor='start', opacity=1.0, spacing=0):
    return (f'<text x="{x}" y="{y}" {FONT} font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}" opacity="{opacity}" letter-spacing="{spacing}">{escape(s)}</text>')


def wrap(s, size, width):
    """Greedy word wrap on an estimated advance of 0.53 em per character."""
    lines, line = [], ''
    for word in s.split():
        trial = f'{line} {word}'.strip()
        if len(trial) * size * 0.53 > width and line:
            lines.append(line)
            line = word
        else:
            line = trial
    if line:
        lines.append(line)
    return lines


def paragraphs(x, y, paras, size, leading, width, fill, gap=None):
    gap = leading if gap is None else gap
    out = []
    for para in paras:
        for line in wrap(para, size, width):
            out.append(text(x, y, line, size, fill))
            y += leading
        y += gap
    return '\n'.join(out), y


def bars(x, y, rows, label_w, track_w, row_h, scale_max, label_size, value_size,
         track, label_fill=INK):
    """One labelled bar per row: label, track, fill, and the value at the end."""
    out = []
    for label, pct, colour in rows:
        out.append(text(x, y, label, label_size, label_fill))
        bx = x + label_w
        out.append(f'<rect x="{bx}" y="{y - 22}" width="{track_w}" height="24" rx="12" fill="{track}"/>')
        fill_w = max(24, track_w * pct / scale_max)
        out.append(f'<rect x="{bx}" y="{y - 22}" width="{fill_w:.0f}" height="24" rx="12" fill="{colour}"/>')
        out.append(text(bx + track_w + 190, y + 4, f'{pct} %', value_size, INK, anchor='end'))
        y += row_h
    return '\n'.join(out)


def page(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" '
            f'viewBox="0 0 {W} {H}" fill="none">\n{body}\n</svg>\n')


def left():
    """Full-bleed purple: one finding, large, with the chart behind it."""
    lead, _ = paragraphs(150, 1250, [
        'Spurgt, hvor AI ville gøre den største forskel i lønarbejdet, peger flest på en kontrol, '
        'der fanger fejl, før lønnen bliver godkendt. Selve automatiseringen af arbejdet kommer langt efter.'
    ], 40, 58, 1650, '#ffffff')

    body = f'''
  <defs>
    <linearGradient id="purple" x1="0" y1="0" x2="{W}" y2="{H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#7a3dff"/>
      <stop offset="1" stop-color="#5216d6"/>
    </linearGradient>
    <clipPath id="pg"><rect width="{W}" height="{H}"/></clipPath>
  </defs>
  <g clip-path="url(#pg)">
    <rect width="{W}" height="{H}" fill="url(#purple)"/>
    <circle cx="2060" cy="260" r="520" fill="#ffffff" opacity="0.06"/>
    <circle cx="80" cy="2900" r="380" fill="#ffffff" opacity="0.05"/>

    {text(150, 170, REPORT, 30, '#ffffff', opacity=0.7)}
    {text(1950, 170, 'Kapitel 2 · AI i lønnen', 30, '#ffffff', anchor='end', opacity=0.7)}
    <rect x="150" y="205" width="1800" height="2" fill="#ffffff" opacity="0.25"/>

    {text(138, 840, '41 %', 520, '#ffffff', spacing=-18)}
    {text(150, 1000, 'vil have AI til at kontrollere lønnen,', 92, '#ffffff', spacing=-2)}
    {text(150, 1108, 'ikke til at køre den.', 92, '#ffffff', spacing=-2)}
    {lead}

    <rect x="150" y="1500" width="1800" height="1040" rx="40" fill="#ffffff"/>
    {text(230, 1610, 'Hvor ville AI hjælpe mest?', 46, INK, spacing=-1)}
    {text(230, 1662, 'Respondenter med ansvar for løn. Ét svar hver.', 28, INK3)}
    {bars_with_labels_above()}

    {text(150, 2730, '47 %', 132, '#ffffff', spacing=-4)}
    {text(560, 2680, 'af lønmodtagerne vil selv bruge AI til at tjekke', 38, '#ffffff', opacity=0.92)}
    {text(560, 2734, 'deres lønseddel for fejl, fx et manglende tillæg.', 38, '#ffffff', opacity=0.92)}

    {text(150, 2880, '14', 26, '#ffffff', opacity=0.7)}
    {text(230, 2880, FOOTNOTE_LEFT, 24, '#ffffff', opacity=0.6)}
  </g>'''
    return page(body)


def bars_with_labels_above():
    """The left page's bars: label on its own line, bar and value beneath."""
    rows = [
        ('Kontrol af lønkørslen, før den godkendes', 41, BRAND),
        ('Svar på spørgsmål om løn, ferie og regler', 20, BRAND_PALE),
        ('Ikke klar til AI endnu', 19, BRAND_PALE),
        ('Indlæsning og bogføring af bilag', 17, BRAND_PALE),
        ('Opsætning af nye kunder', 3, BRAND_PALE),
    ]
    out, y = [], 1760
    for label, pct, colour in rows:
        out.append(text(230, y, label, 34, INK if colour == BRAND else INK2))
        out.append(f'<rect x="230" y="{y + 24}" width="1400" height="26" rx="13" fill="{BRAND_SOFT}"/>')
        out.append(f'<rect x="230" y="{y + 24}" width="{max(26, 1400 * pct / 50):.0f}" height="26" rx="13" fill="{colour}"/>')
        out.append(text(1870, y + 50, f'{pct} %', 58, INK if colour == BRAND else INK2, anchor='end', spacing=-1))
        y += 150
    return '\n'.join(out)


def intake():
    """Three figures on how payroll data reaches a bureau."""
    out = [text(150, 1500, 'Sådan kommer løndata ind hos bureauerne', 34, INK)]
    for i, (pct, label) in enumerate((
        (70, 'på mail eller i et Excel-ark'),
        (48, 'via en kundeportal'),
        (46, 'fra et tidsregistreringssystem'),
    )):
        x = 150 + i * 620
        out.append(f'<rect x="{x}" y="1545" width="560" height="4" rx="2" fill="{BRAND if i == 0 else BRAND_PALE}"/>')
        out.append(text(x - 6, 1690, f'{pct} %', 120, BRAND if i == 0 else INK, spacing=-4))
        out.append(text(x, 1750, label, 31, INK2))
    return '\n'.join(out)


def right():
    """White page: headline, two columns of text, and the chart as the picture."""
    intro, _ = paragraphs(150, 800, [
        'Lønbureauerne bruger ikke mest tid på selve lønkørslen. '
        'De bruger den på at få fat i det, der skal ind i den.'
    ], 46, 64, 1780, INK)

    col1, _ = paragraphs(150, 1040, [
        'Syv ud af ti lønbureauer peger på den samme tidsrøver: at jage løndata og svar '
        'hos kunderne, inden deadline. Ingen anden udfordring kommer i nærheden.',
        'Problemet starter allerede ved indsamlingen. 70 % får stadig løndata på mail, '
        'typisk som et Excel-ark eller en kort besked, og hvert fjerde bureau modtager '
        "papir, scannede sedler eller PDF'er.",
    ], 31, 47, 840, INK2, gap=30)
    col2, _ = paragraphs(1110, 1040, [
        'Til gengæld er flere lønsystemer næsten ikke et problem. Kun 4 % nævner det, '
        'selvom to ud af tre bureauer kører løn i mindst to systemer.',
        'Når bureauerne selv rangerer, hvad der betyder mest, ligger integration til '
        'regnskabet øverst, tæt fulgt af kunder, der selv leverer og godkender deres data.',
    ], 31, 47, 840, INK2, gap=30)

    chart = bars(230, 2080, [
        ('At jage løndata og svar hos kunderne', 70, BRAND),
        ('Spørgsmål fra kundernes medarbejdere', 28, BRAND_PALE),
        ('Godkendelse og dokumentation', 28, BRAND_PALE),
        ('Manglende massehandlinger', 17, BRAND_PALE),
        ('Opsætning af nye kunder', 15, BRAND_PALE),
        ('Skift mellem kunder og logins', 11, BRAND_PALE),
        ('At arbejde i flere lønsystemer', 4, BRAND_PALE),
    ], label_w=760, track_w=680, row_h=96, scale_max=70, label_size=31, value_size=44,
        track='#ffffff', label_fill=INK2)

    body = f'''
  <rect width="{W}" height="{H}" fill="#ffffff"/>

  {text(150, 170, 'Kapitel 3 · Lønbureauerne', 30, INK3)}
  {text(1950, 170, REPORT, 30, INK3, anchor='end')}
  <rect x="150" y="205" width="1800" height="2" fill="#e8e6f0"/>

  {text(150, 370, 'Lønbureauerne', 40, BRAND)}
  {text(144, 510, 'Flaskehalsen er kunden,', 120, INK, spacing=-4)}
  {text(144, 636, 'ikke systemet.', 120, INK, spacing=-4)}
  {intro}

  {col1}
  {col2}

  {intake()}

  <rect x="150" y="1830" width="1800" height="900" rx="40" fill="{GROUND}"/>
  {text(230, 1940, 'Største tidsrøvere', 46, INK, spacing=-1)}
  {text(230, 1992, 'Lønbureauer. Flere svar mulige.', 28, INK3)}
  {chart}

  {text(150, 2880, FOOTNOTE_RIGHT, 24, INK3)}
  {text(1950, 2880, '15', 26, INK3, anchor='end')}'''
    return page(body)


FOOTNOTE_LEFT = ('Foreløbige tal fra Lønmarkedsundersøgelsen 2026, 7. oktober. '
                 '150 svar med systemansvar, 58 lønmodtagere.')
FOOTNOTE_RIGHT = ('Foreløbige tal fra Lønmarkedsundersøgelsen 2026, 7. oktober. '
                  '46 lønbureauer. Flere svar mulige.')


def main():
    design = os.path.join(ROOT, 'design')
    for name, svg in (('spread-left', left()), ('spread-right', right())):
        path = os.path.join(design, f'{name}.svg')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(svg)
        for width, suffix in ((1240, ''), (2480, '@2x')):
            subprocess.run(['rsvg-convert', '-w', str(width), path,
                            '-o', os.path.join(design, f'{name}{suffix}.png')], check=True)
        print(f'design/{name}.svg, .png and @2x.png')


if __name__ == '__main__':
    main()
