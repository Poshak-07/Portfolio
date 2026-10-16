"""Convert genuine captures using already-installed Pillow. No remote assets."""
from pathlib import Path
from PIL import Image

output = Path('public/assets')
for name in ['cricket-prototype', 'cricket-comparison', 'svln-desktop', 'svln-mobile']:
    image = Image.open(Path('.qa') / f'{name}.png').convert('RGB')
    image.save(output / f'{name}.webp', 'WEBP', quality=86, method=6)
    if image.width > 800:
        image.thumbnail((800, 800))
        image.save(output / f'{name}-800.webp', 'WEBP', quality=83, method=6)
    print(f'{name}: {(output / f"{name}.webp").stat().st_size:,} bytes')
