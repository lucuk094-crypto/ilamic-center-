"""Ambil daftar & isi khutbah / bahtsul masail dari islam.nu.or.id -> data/*.json.
Jalankan manual: python3 scripts/fetch-islam-nu.py [jumlah_halaman_daftar]"""
import html, json, re, sys, time, urllib.request
from pathlib import Path

BASE = "https://islam.nu.or.id"
OUT = Path(__file__).resolve().parent.parent / "data"
PAGES = int(sys.argv[1]) if len(sys.argv) > 1 else 3
UA = {"User-Agent": "Mozilla/5.0 (IslamicCenter content fetcher)"}

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "ignore")

def clean(t):
    t = html.unescape(re.sub(r"<[^>]+>", " ", t)).replace("\xa0", " ")
    return re.sub(r"\s+", " ", t).strip()

def listing(section, pages):
    slugs, seen = [], set()
    urls = [f"{BASE}/{section}"] + [f"{BASE}/{section}/{i}" for i in range(2, pages + 1)]
    for u in urls:
        try:
            s = get(u)
        except Exception as e:
            print("listing gagal", u, e); continue
        for m in re.finditer(rf'href="(/{section}/[^"#?]+)"', s):
            p = m.group(1)
            if p.count("/") == 2 and not p.split("/")[-1].isdigit() and p not in seen:
                seen.add(p); slugs.append(p)
        time.sleep(0.3)
    return slugs

def article(path):
    s = get(BASE + path)
    title = re.search(r"<title>(.*?)</title>", s, re.S)
    title = clean(title.group(1)).replace(" - NU Online", "").strip() if title else path
    m = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
    headline = clean(m.group(1)) if m else title
    date = re.search(r'<p class="mt-3[^"]*">(.*?)</p>', s, re.S)
    date = clean(date.group(1)) if date else ""
    ld = []
    for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        if '"NewsArticle"' in x:
            try: ld.append(json.loads(x))
            except ValueError: pass
    desc = ld[0].get("description", "") if ld else ""
    author = ""
    if ld:
        a = ld[0].get("author")
        if isinstance(a, dict): author = a.get("name", "")
        elif isinstance(a, str): author = a
    # isi: setelah "Download PDF" sampai "Baca Juga" / "Lihat Semua"
    body = ""
    b = re.sub(r"<script.*?</script>|<style.*?</style>", "", s, flags=re.S)
    i = b.find("Download PDF")
    if i >= 0:
        seg = b[i + len("Download PDF"):]
        j = min([k for k in [seg.find("Baca Juga"), seg.find("Lihat Semua"), seg.find("Tags")] if k > 0] or [len(seg)])
        body = clean(seg[:j])
    paras = [p.strip() for p in re.split(r"\s{2,}|(?<=[.!?”])\s+(?=[A-Z])", body) if p.strip()]
    return {
        "slug": path.split("/")[-1],
        "path": path,
        "judul": headline,
        "tanggal": date,
        "penulis": author,
        "deskripsi": desc,
        "isi": body,
    }

def run(section, out_name):
    paths = listing(section, PAGES)
    items = []
    for p in paths:
        try:
            items.append(article(p))
        except Exception as e:
            print("artikel gagal", p, e)
        time.sleep(0.3)
    (OUT / out_name).write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding="utf-8")
    print(section, len(items), "item ->", out_name)

if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    run("khutbah", "khutbah.json")
    run("bahtsul-masail", "bahtsul-masail.json")
