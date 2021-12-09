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

