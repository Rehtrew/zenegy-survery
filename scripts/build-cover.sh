#!/usr/bin/env bash
# Renders the fictive report cover from design/report-cover.svg.
#
#   npm run gen:cover
#
# Needs librsvg (brew install librsvg). PP Neue Montreal has to be installed on
# the machine doing the rendering, or the type falls back to a system sans.
set -euo pipefail
cd "$(dirname "$0")/.."

rsvg-convert -w 1240 design/report-cover.svg -o design/report-cover.png        # screen
rsvg-convert -w 2480 design/report-cover.svg -o design/report-cover@2x.png     # slides, 300 dpi
rsvg-convert -f pdf -w 595 -h 842 design/report-cover.svg -o design/report-cover.pdf  # print, vector A4

echo "design/report-cover.png, @2x.png and .pdf rebuilt."
