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
