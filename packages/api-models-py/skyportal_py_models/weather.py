"""Request and response models for ``/api/weather``."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict


class Weather(BaseModel):
    """Cached OpenWeather data for a telescope site (upstream ``Weather``).

    The handler builds this dict by hand rather than serializing the model:
    ``weather`` is the raw OpenWeather ``weather_info`` JSON blob,
    ``weather_retrieved_at`` is the model's ``retrieved_at``, and the
    remaining keys are copied off the associated ``Telescope``.
    """

    model_config = ConfigDict(extra="forbid")

    weather: dict[str, Any] | None = None
    weather_retrieved_at: datetime | None = None
    weather_fetch_at: datetime | None = None
    weather_link: str | None = None
    telescope_name: str | None = None
    telescope_nickname: str | None = None
    telescope_id: int | None = None
    message: str | None = None
