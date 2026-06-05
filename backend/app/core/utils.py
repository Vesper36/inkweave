import re
from typing import Optional


def generate_slug(text: str, max_length: int = 100) -> str:
    """Generate a URL-friendly slug from text."""
    # Convert to lowercase
    slug = text.lower().strip()
    # Replace Chinese characters and spaces with hyphens (keep for SEO)
    slug = re.sub(r'[\s]+', '-', slug)
    # Remove non-alphanumeric characters (except hyphens and Chinese)
    slug = re.sub(r'[^\w一-鿿-]', '', slug)
    # Collapse multiple hyphens
    slug = re.sub(r'-+', '-', slug)
    # Trim hyphens from ends
    slug = slug.strip('-')
    # Truncate
    if len(slug) > max_length:
        slug = slug[:max_length].rstrip('-')
    return slug or "untitled"


def count_words(text: str) -> int:
    """Count words in text, handling both CJK and Latin characters."""
    if not text:
        return 0
    # Count CJK characters individually
    cjk_count = len(re.findall(r'[一-鿿㐀-䶿]', text))
    # Count Latin words
    latin_text = re.sub(r'[一-鿿㐀-䶿]', ' ', text)
    latin_words = len(latin_text.split())
    return cjk_count + latin_words


def truncate_html(html: str, max_length: int = 200) -> str:
    """Truncate HTML content to plain text summary."""
    text = re.sub(r'<[^>]+>', '', html)
    text = text.strip()
    if len(text) > max_length:
        return text[:max_length] + "..."
    return text
