# Changelog

## 1.0.0 - 15/01/2021

Initial release to match server API version `2020-12`

## 1.1.0 - 02/12/2021

Minor version release to match server API version `2021-09`

Search changes:

 - Add search result fields `platform`, `offNadir`
 - Add new search filters for `supplier`, `cloudCover`, and `offNadir`

Resource changes:

 - Deprecated resource `type` field (retained, and still in use for support)  
 - added new fields `roles`, `format`, `size` and `checksum`
 - added resource "download to file" support.

## 2.0.0 - 01/07/2022

Major version release to match server API version `2022-07`

Search changes:
 - endpoint response object is now `SearchResponse` not `SearchResult[]`
 - removed the `eula` and `price` fields
 - renamed the fields `id` to `orderingID` and `resolution` to `gsd`
 - added new fields `bands` `bundles` and `license`
 - rewrote decoder to allow structure to be backward compatible with APIs running previous version

Order changes:
 - removed `seats` argument
 - added `bundleKey` argument

## 2.0.1 - 09/07/2022

Fixing omitted term changes in 2.0.0

Search changes:
 - search `res` query parameter changed to gsd

Order changes:
 - order structure changed `imageryID` to `orderingID`

# 2.0.2 - 11/07/2022

api version `2022-09` cleanup

 - removed backwards compatibility with past server version `2021-09`
 - add optional field `name` to bundle option
 - add `calculatePrice` on search results to get price in US Cents
 - adding/enabling additional tests to cover new server version

# 2.1.0 - 17/01/2023

api version `2023-01` support

 - added `polygon` method to search request, allowing search by WKT and array polygon

# 3.0.0 - 15/08/2024

API version `2024-07` support

 - rename `Order` class to `Dataset`
 - introduce new `Order` and tasking `Campaign` class entities
 - rework of orders api to support the above resources (list, get, sublist child entities)
 - ordering endpoints now return the new `Order` entity (single, even for batch order)
 - tasking search response removed the `area` property and added `metrics`
 - tasking search response added `priorities` and `cloudLevels` fields describing order options
 - tasking order request added `priorityKey` and `cloud` to specify additional order options
