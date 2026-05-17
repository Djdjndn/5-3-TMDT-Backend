from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import shutil

ROOT = Path(__file__).resolve().parents[1]
UPLOADS = ROOT / "uploads" / "products"
UPLOADS.mkdir(parents=True, exist_ok=True)

EXTENSION_FIXES = {
    "1749460856937.jpeg": "1749460856937.jpg",
    "1749462188384.jpeg": "1749462188384.jpg",
    "1749461631888.jpeg": "1749461631888.jpg",
}

AVIF_FIXES = {
    "1749461000568.avif": "1749461000568.jpg",
}

DEMO_PRODUCTS = [
    ("demo_iphone15_blue.jpg", "iPhone 15", "Blue", ("#dbeafe", "#2563eb")),
    ("demo_iphone15pro_titan.jpg", "iPhone 15 Pro", "Titanium", ("#e5e7eb", "#111827")),
    ("demo_galaxy_s24.jpg", "Galaxy S24", "AI Phone", ("#ecfeff", "#0891b2")),
    ("demo_galaxy_a55.jpg", "Galaxy A55", "Awesome", ("#f0fdf4", "#16a34a")),
    ("demo_redmi_note_13.jpg", "Redmi Note 13", "AMOLED", ("#fff7ed", "#ea580c")),
    ("demo_macbook_air_m3.jpg", "MacBook Air M3", "Light", ("#f8fafc", "#475569")),
    ("demo_dell_xps_13.jpg", "Dell XPS 13", "Ultrabook", ("#eff6ff", "#1d4ed8")),
    ("demo_asus_tuf_a15.jpg", "ASUS TUF A15", "Gaming", ("#fef2f2", "#b91c1c")),
    ("demo_airpods_4.jpg", "AirPods 4", "Audio", ("#f5f3ff", "#7c3aed")),
    ("demo_sony_xm5.jpg", "Sony WH-1000XM5", "Noise Cancel", ("#f3f4f6", "#374151")),
    ("demo_anker_20k.jpg", "Anker 20K", "Power Bank", ("#f0f9ff", "#0284c7")),
    ("demo_usb_c_100w.jpg", "USB-C 100W", "Cable", ("#fafaf9", "#57534e")),
]


def font(size: int):
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def draw_center(draw: ImageDraw.ImageDraw, text: str, y: int, fill: str, font_obj):
    bbox = draw.textbbox((0, 0), text, font=font_obj)
    x = (900 - (bbox[2] - bbox[0])) // 2
    draw.text((x, y), text, fill=fill, font=font_obj)


def make_demo_image(filename: str, title: str, subtitle: str, palette):
    path = UPLOADS / filename
    if path.exists():
        return

    bg, accent = palette
    img = Image.new("RGB", (900, 900), bg)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((170, 145, 730, 690), radius=58, fill="#ffffff", outline=accent, width=7)
    draw.rounded_rectangle((255, 215, 645, 595), radius=36, fill="#f8fafc", outline="#e5e7eb", width=4)
    draw.ellipse((385, 615, 515, 745), fill=accent)
    draw_center(draw, title, 70, "#111827", font(58))
    draw_center(draw, subtitle, 785, accent, font(42))
    draw_center(draw, "TMDT Demo", 840, "#6b7280", font(28))
    img.save(path, "JPEG", quality=92)


def main():
    for src, dest in EXTENSION_FIXES.items():
        src_path = UPLOADS / src
        dest_path = UPLOADS / dest
        if src_path.exists() and not dest_path.exists():
            shutil.copyfile(src_path, dest_path)

    for src, dest in AVIF_FIXES.items():
        src_path = UPLOADS / src
        dest_path = UPLOADS / dest
        if src_path.exists() and not dest_path.exists():
            Image.open(src_path).convert("RGB").save(dest_path, "JPEG", quality=92)

    for filename, title, subtitle, palette in DEMO_PRODUCTS:
        make_demo_image(filename, title, subtitle, palette)

    print(f"Prepared images in {UPLOADS}")


if __name__ == "__main__":
    main()
