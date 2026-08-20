/**
 * @since 1.0.0
 */

/**
 * Request and response models for `/api/allocation`.
 *
 * @since 1.0.0
 */
export * as Allocations from "./Allocations.ts"

/**
 * Request and response models for `/api/analysis_service` and
 * `/api/obj/analysis`.
 *
 * @since 1.0.0
 */
export * as Analysis from "./Analysis.ts"

/**
 * Request and response models for source annotations.
 *
 * @since 1.0.0
 */
export * as Annotations from "./Annotations.ts"

/**
 * Request and response models for `/api/assignment`.
 *
 * @since 1.0.0
 */
export * as Assignments from "./Assignments.ts"

/**
 * Request and response models for `/api/brokers`.
 *
 * @since 1.0.0
 */
export * as Brokers from "./Brokers.ts"

/**
 * Request and response models for `/api/candidates`.
 *
 * @since 1.0.0
 */
export * as Candidates from "./Candidates.ts"

/**
 * Request and response models for `/api/catalog_queries` and `/api/catalogs`.
 *
 * @since 1.0.0
 */
export * as CatalogQueries from "./CatalogQueries.ts"

/**
 * Request and response models for classifications.
 *
 * @since 1.0.0
 */
export * as Classifications from "./Classifications.ts"

/**
 * Request and response models for source comments.
 *
 * @since 1.0.0
 */
export * as Comments from "./Comments.ts"

/**
 * Request and response models for `/api/earthquake`.
 *
 * @since 1.0.0
 */
export * as Earthquakes from "./Earthquakes.ts"

/**
 * Request and response models for `/api/filters`.
 *
 * @since 1.0.0
 */
export * as Filters from "./Filters.ts"

/**
 * Request and response models for `/api/followup_request`.
 *
 * @since 1.0.0
 */
export * as FollowupRequests from "./FollowupRequests.ts"

/**
 * Request and response models for `/api/galaxy_catalog`.
 *
 * @since 1.0.0
 */
export * as Galaxies from "./Galaxies.ts"

/**
 * Request and response models for `/api/gcn_event`.
 *
 * Every model below whose upstream row hangs off a `GcnEvent` keeps its
 * `gcnevent` back-reference free-form: {@link GcnEvent} already types the
 * forward direction, so typing the reverse one too would make the models
 * mutually recursive.
 *
 * @since 1.0.0
 */
export * as GcnEvents from "./GcnEvents.ts"

/**
 * Request and response models for `/api/group_admission_requests`.
 *
 * @since 1.0.0
 */
export * as GroupAdmissionRequests from "./GroupAdmissionRequests.ts"

/**
 * Request and response models for `/api/groups`.
 *
 * @since 1.0.0
 */
export * as Groups from "./Groups.ts"

/**
 * Request and response models for `/api/healpix`.
 *
 * @since 1.0.0
 */
export * as Healpix from "./Healpix.ts"

/**
 * Request and response models for `/api/instrument`.
 *
 * @since 1.0.0
 */
export * as Instruments from "./Instruments.ts"

/**
 * Request and response models for `/api/invitations`.
 *
 * @since 1.0.0
 */
export * as Invitations from "./Invitations.ts"

/**
 * Request and response models for `/api/listing`.
 *
 * @since 1.0.0
 */
export * as Listings from "./Listings.ts"

/**
 * Request and response models for `/api/localization`.
 *
 * @since 1.0.0
 */
export * as Localizations from "./Localizations.ts"

/**
 * Request and response models for `/api/mmadetector`.
 *
 * @since 1.0.0
 */
export * as MmaDetectors from "./MmaDetectors.ts"

/**
 * Request and response models for `/api/moving_object`.
 *
 * @since 1.0.0
 */
export * as MovingObjects from "./MovingObjects.ts"

/**
 * Request and response models for `/api/newsfeed`.
 *
 * @since 1.0.0
 */
export * as NewsFeed from "./NewsFeed.ts"

/**
 * Request and response models for `/api/objs` and related endpoints.
 *
 * @since 1.0.0
 */
export * as Objs from "./Objs.ts"

/**
 * Request and response models for `/api/observation_plan`.
 *
 * @since 1.0.0
 */
export * as ObservationPlans from "./ObservationPlans.ts"

/**
 * Request and response models for `/api/observation`.
 *
 * @since 1.0.0
 */
export * as Observations from "./Observations.ts"

/**
 * Request and response models for `/api/observing_run`.
 *
 * @since 1.0.0
 */
export * as ObservingRuns from "./ObservingRuns.ts"

/**
 * Request and response models for `/api/photometric_series`.
 *
 * @since 1.0.0
 */
export * as PhotometricSeries from "./PhotometricSeries.ts"

/**
 * Request and response models for photometry.
 *
 * @since 1.0.0
 */
export * as Photometry from "./Photometry.ts"

/**
 * Request and response models for `/api/internal/profile`.
 *
 * @since 1.0.0
 */
export * as Profile from "./Profile.ts"

/**
 * Request and response models for `/api/public_pages`.
 *
 * @since 1.0.0
 */
export * as PublicPages from "./PublicPages.ts"

/**
 * Request and response models for `/api/recurring_api`.
 *
 * @since 1.0.0
 */
export * as RecurringApis from "./RecurringApis.ts"

/**
 * Request and response models for `/api/{resourceType}/{id}/reminders`.
 *
 * @since 1.0.0
 */
export * as Reminders from "./Reminders.ts"

/**
 * Request and response models for `/api/roles`.
 *
 * @since 1.0.0
 */
export * as Roles from "./Roles.ts"

/**
 * Building blocks shared by the models of every resource module.
 *
 * @since 1.0.0
 */
export * as Schemas from "./Schemas.ts"

/**
 * Request and response models for `/api/sharing_service`.
 *
 * @since 1.0.0
 */
export * as SharingServices from "./SharingServices.ts"

/**
 * Request and response models for `/api/shifts`.
 *
 * @since 1.0.0
 */
export * as Shifts from "./Shifts.ts"

/**
 * Request and response models for `/api/skymap_trigger`.
 *
 * @since 1.0.0
 */
export * as SkymapTriggers from "./SkymapTriggers.ts"

/**
 * Request and response models for `/api/source_groups`.
 *
 * @since 1.0.0
 */
export * as SourceGroups from "./SourceGroups.ts"

/**
 * Request and response models for `/api/sources`.
 *
 * @since 1.0.0
 */
export * as Sources from "./Sources.ts"

/**
 * Request and response models for `/api/spatial_catalog`.
 *
 * @since 1.0.0
 */
export * as SpatialCatalogs from "./SpatialCatalogs.ts"

/**
 * Request and response models for spectra.
 *
 * @since 1.0.0
 */
export * as Spectra from "./Spectra.ts"

/**
 * Request and response models for `/api/streams`.
 *
 * @since 1.0.0
 */
export * as Streams from "./Streams.ts"

/**
 * Request and response models for `/api/summary_query`.
 *
 * @since 1.0.0
 */
export * as SummaryQuery from "./SummaryQuery.ts"

/**
 * Request and response models for `/api/survey_efficiency`.
 *
 * @since 1.0.0
 */
export * as SurveyEfficiency from "./SurveyEfficiency.ts"

/**
 * Request and response models for the instance introspection endpoints.
 *
 * @since 1.0.0
 */
export * as System from "./System.ts"

/**
 * Request and response models for `/api/objtagoption` and `/api/objtag`.
 *
 * @since 1.0.0
 */
export * as Tags from "./Tags.ts"

/**
 * Request and response models for `/api/taxonomy`.
 *
 * @since 1.0.0
 */
export * as Taxonomies from "./Taxonomies.ts"

/**
 * Request and response models for `/api/teams`.
 *
 * @since 1.0.0
 */
export * as Teams from "./Teams.ts"

/**
 * Request and response models for `/api/telescope`.
 *
 * @since 1.0.0
 */
export * as Telescopes from "./Telescopes.ts"

/**
 * Request and response models for `/api/thumbnail`.
 *
 * @since 1.0.0
 */
export * as Thumbnails from "./Thumbnails.ts"

/**
 * Request and response models for `/api/internal/tokens`.
 *
 * @since 1.0.0
 */
export * as Tokens from "./Tokens.ts"

/**
 * Request and response models for `/api/user`.
 *
 * @since 1.0.0
 */
export * as Users from "./Users.ts"

/**
 * Request and response models for `/api/weather`.
 *
 * @since 1.0.0
 */
export * as Weather from "./Weather.ts"
