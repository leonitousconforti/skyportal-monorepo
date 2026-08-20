"""Smoke tests for the shared request/response models."""

from __future__ import annotations

import importlib
import inspect

import pytest
from pydantic import BaseModel, ValidationError

import skyportal_py_models
from skyportal_py_models.sources import Source, SourcesPage


@pytest.mark.parametrize("name", skyportal_py_models.__all__)
def test_module_imports_and_holds_only_pydantic_models(name: str) -> None:
    """Every module imports cleanly and defines models, never client code."""
    module = importlib.import_module(f"skyportal_py_models.{name}")
    assert not hasattr(module, "httpx")
    for _, obj in inspect.getmembers(module, inspect.isclass):
        if obj.__module__ == module.__name__:
            assert issubclass(obj, BaseModel), f"{name}.{obj.__name__} is not a model"


def test_models_are_strict() -> None:
    """Unknown fields in a server response are an error, not silently dropped."""
    with pytest.raises(ValidationError, match="surprise"):
        Source.model_validate({"id": "ZTF20abcdef", "surprise": True})


def test_wire_aliases_are_accepted() -> None:
    """camelCase wire names validate into snake_case attributes."""
    page = SourcesPage.model_validate(
        {"sources": [], "totalMatches": 3, "pageNumber": 2, "numPerPage": 1}
    )
    assert page.total_matches == 3
    assert page.page_number == 2
