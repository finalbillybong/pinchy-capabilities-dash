#!/usr/bin/env bash
#
# generate-icons.sh
#
# Generates PWA icon PNGs from the SVG source files.
#
# Prerequisites (pick one):
#   - Inkscape:  sudo apt install inkscape
#   - rsvg:      sudo apt install librsvg2-bin
#   - ImageMagick with librsvg: sudo apt install imagemagick librsvg2-bin
#
# Usage:
#   ./scripts/generate-icons.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ICONS_DIR="$PROJECT_ROOT/public/icons"

SIZES=(192 512)

echo "=== Pinchy PWA Icon Generator ==="
echo ""

# Detect available tool
if command -v inkscape &> /dev/null; then
  TOOL="inkscape"
elif command -v rsvg-convert &> /dev/null; then
  TOOL="rsvg"
elif command -v convert &> /dev/null; then
  TOOL="imagemagick"
else
  echo "ERROR: No suitable SVG-to-PNG converter found."
  echo ""
  echo "Install one of the following:"
  echo "  sudo apt install inkscape"
  echo "  sudo apt install librsvg2-bin"
  echo "  sudo apt install imagemagick"
  echo ""
  echo "Alternatively, open the following file in a browser to generate PNGs manually:"
  echo "  $ICONS_DIR/generate-icons.html"
  exit 1
fi

echo "Using tool: $TOOL"
echo ""

for SIZE in "${SIZES[@]}"; do
  SVG="$ICONS_DIR/icon-${SIZE}.svg"
  PNG="$ICONS_DIR/icon-${SIZE}.png"

  if [ ! -f "$SVG" ]; then
    echo "WARNING: $SVG not found, skipping."
    continue
  fi

  echo "Generating icon-${SIZE}.png ..."

  case "$TOOL" in
    inkscape)
      inkscape "$SVG" --export-type=png --export-filename="$PNG" -w "$SIZE" -h "$SIZE" 2>/dev/null
      ;;
    rsvg)
      rsvg-convert -w "$SIZE" -h "$SIZE" "$SVG" -o "$PNG"
      ;;
    imagemagick)
      convert -background none -resize "${SIZE}x${SIZE}" "$SVG" "$PNG"
      ;;
  esac

  if [ -f "$PNG" ] && [ -s "$PNG" ]; then
    echo "  -> $PNG ($(wc -c < "$PNG") bytes)"
  else
    echo "  -> WARNING: $PNG was not generated correctly."
  fi
done

echo ""
echo "Done. Icons are in: $ICONS_DIR/"
echo ""
echo "NOTE: The placeholder PNG files have been replaced with real icons."
echo "      If the crab emoji did not render correctly (common with CLI tools),"
echo "      open $ICONS_DIR/generate-icons.html in a browser instead."
