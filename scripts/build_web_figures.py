"""Encode responsive web copies of the approved figures (requires Pillow).

Keep the source JPEGs for the README and sharing. No recoloring or redrawing.
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "docs/assets"


def main():
    for source, widths in (
        ("overview-13f65796.jpg", (1600, 3200)),
        ("wafer-to-chip.jpg", (1400, 2800)),
    ):
        with Image.open(ASSETS / source) as image:
            for width in widths:
                height = round(image.height * width / image.width)
                variant = image.resize((width, height), Image.Resampling.LANCZOS)
                target = ASSETS / "web" / f"{Path(source).stem}-{width}.webp"
                variant.save(target, quality=90, method=6)
                print(f"{target.relative_to(ROOT)}: {target.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
