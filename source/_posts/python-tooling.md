---
title: Python Tooling in 2026
date: 2026-03-27 09:00:00
categories: [Development]
tags: [python, tooling, packaging, uv]
cover_image: https://picsum.photos/seed/python/800/450
excerpt: uv, ruff, pyproject.toml, and type annotations — the modern Python toolchain that makes dependency management and code quality feel effortless.
---

Python's tooling story has improved dramatically. Here is what a modern setup looks like.

## pyproject.toml — the single config file

```toml
[project]
name = "my-project"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "httpx>=0.27",
    "pydantic>=2.7",
    "rich>=13.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "ruff>=0.4",
    "mypy>=1.10",
]

[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "W", "F", "I", "UP", "B"]
ignore = ["E501"]

[tool.mypy]
strict = true
python_version = "3.12"
```

## uv — fast package management

```bash
# Create a virtual environment and install deps in one step
uv venv && uv pip install -e ".[dev]"

# Run a script in an isolated environment
uv run python scripts/generate_data.py

# Add a dependency and update the lock file
uv add httpx

# Sync the environment to the lock file exactly
uv sync
```

{% note tip %}
`uv` resolves and downloads packages in parallel. On a cold install of a medium-sized project, it is typically 10–100× faster than `pip`.
{% endnote %}

## Type annotations — practical patterns

```python
from typing import TypeVar, Generic, Callable, Any
from collections.abc import Iterator

T = TypeVar('T')
U = TypeVar('U')

class Result(Generic[T]):
    """A simple Result type — either Ok(value) or Err(message)."""

    def __init__(self, value: T | None, error: str | None) -> None:
        self._value = value
        self._error = error

    @classmethod
    def ok(cls, value: T) -> 'Result[T]':
        return cls(value, None)

    @classmethod
    def err(cls, message: str) -> 'Result[T]':
        return cls(None, message)

    def map(self, fn: Callable[[T], U]) -> 'Result[U]':
        if self._error:
            return Result.err(self._error)
        return Result.ok(fn(self._value))  # type: ignore[arg-type]

    def unwrap(self) -> T:
        if self._error:
            raise ValueError(self._error)
        return self._value  # type: ignore[return-value]
```

## dataclasses with validation

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass(frozen=True, slots=True)
class Post:
    title: str
    slug: str
    published_at: datetime
    tags: tuple[str, ...] = field(default_factory=tuple)

    def __post_init__(self) -> None:
        if not self.title.strip():
            raise ValueError('title cannot be blank')
        if not self.slug.replace('-', '').isalnum():
            raise ValueError(f'invalid slug: {self.slug!r}')

    @property
    def reading_time(self) -> int:
        # Placeholder — real impl counts words
        return 1
```

## pytest fixtures and parametrize

```python
import pytest
from myapp.models import Post
from datetime import datetime

@pytest.fixture
def sample_post() -> Post:
    return Post(
        title='Hello World',
        slug='hello-world',
        published_at=datetime(2026, 1, 1),
        tags=('python', 'testing'),
    )

@pytest.mark.parametrize('slug,valid', [
    ('hello-world', True),
    ('Hello World', False),
    ('hello_world', False),
    ('hello-world-2', True),
])
def test_slug_validation(slug: str, valid: bool) -> None:
    if valid:
        Post(title='x', slug=slug, published_at=datetime.now())
    else:
        with pytest.raises(ValueError, match='invalid slug'):
            Post(title='x', slug=slug, published_at=datetime.now())
```
