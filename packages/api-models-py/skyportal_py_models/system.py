"""Request and response models for the instance introspection endpoints."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class GitLogEntry(BaseModel):
    """One parsed commit from the deployed SkyPortal git log."""

    model_config = ConfigDict(extra="forbid")

    time: str | None = None
    sha: str | None = None
    email: str | None = None
    description: str | None = None
    pr_nr: str | None = None
    pr_url: str | None = None
    commit_url: str | None = None
    name: str | None = None


class SysInfo(BaseModel):
    """System and deployment information for the SkyPortal instance."""

    model_config = ConfigDict(extra="forbid")

    gitlog: list[GitLogEntry] = Field(default_factory=list)


class DBInfo(BaseModel):
    """Basic health information about the instance's database."""

    model_config = ConfigDict(extra="forbid")

    source_table_empty: bool | None = None
    postgres_version: str | None = None
