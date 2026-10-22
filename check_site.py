"""Run with python3 check_site.py; no dependencies or network access."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent
PAGES = {name: ROOT / name for name in (
    "index.html", "privacy.html", "support.html", "attributions.html"
)}


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.ids, self.links = set(), []
        self.h1 = self.main = self.current = 0
        self.language = self.viewport = False
        self.feed(path.read_text())

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        assert tag not in {"script", "iframe", "object", "embed", "form"}, tag
        assert not any(key.startswith("on") for key in attrs), "Inline handler"
        if "id" in attrs:
            assert attrs["id"] not in self.ids, "Duplicate ID"
            self.ids.add(attrs["id"])
        self.h1 += tag == "h1"
        self.main += tag == "main"
        self.current += attrs.get("aria-current") == "page"
        self.language |= tag == "html" and attrs.get("lang") == "zh-CN"
        self.viewport |= tag == "meta" and attrs.get("name") == "viewport"
        if tag == "img":
            assert "alt" in attrs, "Missing image alternative"
        for attribute in ("href", "src"):
            if attribute not in attrs:
                continue
            value = attrs[attribute]
            url = urlsplit(value)
            assert not value.startswith("/"), "Use relative paths for GitHub Pages"
            if url.scheme or url.netloc:
                assert tag == "a" and url.scheme in {"https", "mailto"}, "Remote resource"
                if url.scheme == "mailto":
                    assert url.path == "rectfly@fastmail.com", "Unexpected contact"
            else:
                self.links.append(url)


pages = {name: Page(path) for name, path in PAGES.items()}
for name, page in pages.items():
    assert page.h1 == page.main == page.current == 1, name
    assert page.language and page.viewport, name
    for url in page.links:
        target = unquote(url.path) or name
        assert (ROOT / target).is_file(), (name, target)
        if url.fragment:
            assert target in pages and unquote(url.fragment) in pages[target].ids, (name, url)

css = (ROOT / "styles.css").read_text()
assert "@import" not in css and "url(" not in css, "Unexpected stylesheet resource"
assert "prefers-color-scheme: dark" in css
assert "#testflight" in PAGES["index.html"].read_text()
assert "默认关闭" in PAGES["privacy.html"].read_text()
print(f"PASS: {len(pages)} pages; local links/anchors, contact, landmarks, no remote embeds or scripts")
