from __future__ import annotations

from pathlib import Path
from time import sleep
from urllib.parse import quote
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
UPLOADS = ROOT / "uploads" / "products"
UPLOADS.mkdir(parents=True, exist_ok=True)


def commons_file_url(filename: str) -> str:
    return "https://commons.wikimedia.org/wiki/Special:Redirect/file/" + quote(filename) + "?width=1200"


REAL_IMAGES = {
    "demo_iphone15_blue.jpg": commons_file_url("Apple iPhone 15.png"),
    "demo_iphone15pro_titan.jpg": commons_file_url("Apple iPhone 15 Pro.jpg"),
    "demo_galaxy_s24.jpg": commons_file_url("Samsung Galaxy S24.jpg"),
    "demo_galaxy_a55.jpg": commons_file_url("Samsung Galaxy A55 5G 2024 (cropped).jpg"),
    "demo_redmi_note_13.jpg": commons_file_url("Redmi Note 11 Pro back.jpg"),
    "demo_macbook_air_m3.jpg": commons_file_url("Hardware PXL 20240701 181416002 (53829190029).jpg"),
    "demo_dell_xps_13.jpg": commons_file_url("DELL XPS13&XPS15 2 (22320273002).jpg"),
    "demo_asus_tuf_a15.jpg": commons_file_url("ASUS TUF Gaming 5 Pro Laptop.jpg"),
    "demo_airpods_4.jpg": commons_file_url("Airpods 4.jpg"),
    "demo_sony_xm5.jpg": commons_file_url("Sony-WH-1000XM3-kabellose-Bluetooth-Noise-Cancelling-Kopfhoerer.5.jpg"),
    "demo_anker_20k.jpg": commons_file_url("Anker power bank and cable.jpg"),
    "demo_usb_c_100w.jpg": commons_file_url("USB-C-connector-and-cable.png"),
}


def download(url: str) -> bytes:
    request = Request(url, headers={"User-Agent": "TMDT school demo image updater/1.0"})
    for attempt in range(3):
        try:
            with urlopen(request, timeout=45) as response:
                return response.read()
        except HTTPError as error:
            if error.code != 429 or attempt == 2:
                raise
            sleep(5 * (attempt + 1))
    raise RuntimeError(f"Could not download {url}")


def save_square_jpeg(raw: bytes, dest: Path) -> None:
    temp = dest.with_suffix(".source")
    temp.write_bytes(raw)
    try:
        with Image.open(temp) as source:
            source = ImageOps.exif_transpose(source).convert("RGB")
            source.thumbnail((900, 900), Image.Resampling.LANCZOS)

            canvas = Image.new("RGB", (900, 900), "#f8fafc")
            x = (900 - source.width) // 2
            y = (900 - source.height) // 2
            canvas.paste(source, (x, y))
            canvas.save(dest, "JPEG", quality=90, optimize=True)
    finally:
        temp.unlink(missing_ok=True)


def main() -> None:
    failures = []
    saved = 0
    for filename, url in REAL_IMAGES.items():
        dest = UPLOADS / filename
        print(f"Downloading {filename}")
        try:
            raw = download(url)
            save_square_jpeg(raw, dest)
            saved += 1
        except Exception as error:
            failures.append((filename, error))
            print(f"Failed {filename}: {error}")
    print(f"Saved {saved} real product images to {UPLOADS}")
    if failures:
        print("Failures:")
        for filename, error in failures:
            print(f"- {filename}: {error}")


if __name__ == "__main__":
    main()
