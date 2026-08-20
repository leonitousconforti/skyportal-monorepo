"""Request and response models for ``/api/galaxy_catalog``."""

from __future__ import annotations

import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class Galaxy(BaseModel):
    """A galaxy from a galaxy catalog (upstream ``Galaxy``)."""

    # ``objects`` (the ``Obj``s this galaxy is the host of) stays as raw dicts:
    # ``sources.Source`` nests ``Galaxy``, so typing it would be a cycle.

    model_config = ConfigDict(extra="forbid")

    id: int
    created_at: datetime.datetime | None = None
    modified: datetime.datetime | None = None
    catalog_id: int | None = None
    name: str | None = None
    alt_name: str | None = None
    ra: float | None = None
    dec: float | None = None
    healpix: int | None = None
    distmpc: float | None = None
    distmpc_unc: float | None = None
    redshift: float | None = None
    redshift_error: float | None = None
    sfr_fuv: float | None = None
    sfr_w4: float | None = None
    mstar: float | None = None
    magb: float | None = None
    magk: float | None = None
    mag_fuv: float | None = None
    mag_nuv: float | None = None
    mag_w1: float | None = None
    mag_w2: float | None = None
    mag_w3: float | None = None
    mag_w4: float | None = None
    a: float | None = None
    b2a: float | None = None
    pa: float | None = None
    btc: float | None = None
    objects: list[dict[str, Any]] | None = None
    # Injected by the handler when ``returnProbability`` is requested.
    probability: float | None = None


class GalaxiesPage(BaseModel):
    """One page of results from a galaxy catalog query."""

    # Hand-built by the handler, which strips keys whose value is ``None``, so
    # ``sortBy``/``sortOrder`` are absent unless they were requested and
    # ``geojson`` is only present when ``includeGeoJSON`` was set.

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    galaxies: list[Galaxy] = Field(default_factory=list)
    total_matches: int = Field(alias="totalMatches", default=0)
    sort_by: str | None = Field(alias="sortBy", default=None)
    sort_order: str | None = Field(alias="sortOrder", default=None)
    page: int | None = None
    num_per_page: int | None = Field(alias="numPerPage", default=None)
    geojson: dict[str, Any] | None = None


class GalaxyCatalogCount(BaseModel):
    """A galaxy catalog name with its galaxy count."""

    # Hand-built by the handler from an upstream ``GalaxyCatalog`` plus a count
    # of its galaxies; the catalog's description and URL are not returned.

    model_config = ConfigDict(extra="forbid")

    catalog_name: str
    catalog_count: int | None = None


class GalaxyCatalogPost(BaseModel):
    """Payload for ingesting a galaxy catalog."""

    # The upstream OpenAPI schema documents ``catalog_data`` as a list of
    # dicts, but the handler indexes it by column name, so it is really a dict
    # of equal-length column lists.

    model_config = ConfigDict(extra="forbid")

    catalog_name: str
    catalog_data: dict[str, list[Any]]
    catalog_description: str | None = None
    catalog_url: str | None = None


class GalaxyCatalogASCIIPost(BaseModel):
    """Payload for uploading a galaxy catalog from an ASCII file."""

    model_config = ConfigDict(extra="forbid", validate_by_name=True)

    catalog_name: str = Field(alias="catalogName")
    catalog_data: str = Field(alias="catalogData")
    catalog_description: str | None = Field(alias="catalogDescription", default=None)
    catalog_url: str | None = Field(alias="catalogURL", default=None)
