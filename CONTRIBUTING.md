# Contributing and Development

This project is open to community contributions, whether in terms of features, endpoint support, and bug fixing.

Contributions should be made by forking the SDK, making the alterations in a new working branch, then making a pull request to merge the changes.

NOTE: this is intended as a minimal SDK. If you wish to add features beyond the scope of supporting the API, those belong in a separate utility package.  
If you have a proposal for such a feature, please open an issue to discuss it.

## Testing

Due to the small scope of this project at current, its testing approach is somewhat rudimentary.

Testing is done with a small separately built client located in the `e2e` folder, testing involves;
 1. running a webpack build
 2. executing the test script
 3. if errors are logged, the respective test failed

All contributions should pass tests, and if adding a new feature, should test it.

If you identify a test case that is not currently covered, please bring it to our attention, or make a merge request to correct it.

Note: as the system calls the API, credentials are needed for testing.  
To test, a .env file needs to be created at `e2e/.env` which should export the following:
 - `api_key` and `api_secret` corresponding to the API Key and Secret.
 - `order_id` being a search result `id` value to test ordering
 - `order_eula` which contains the corresponding EULA to the above ID
 - `order_key` which contains the order to load in get order tests
 - `resource_id` the id of a resource to load for resource download tests
 - `resource_file1` is a path to download `resource_id` to, when testing download to file path
 - `resource_file2` is a path to download `resource_id` to, when testing download to a file reference

Optionally, if operating behind a proxy, the `host`, and `timeout` options can be provided to set an aliased host/basepath for testing, or extend the default timeout to account for the proxy's round trip.

## Merging

When opening a pull request to contribute an automated test will occur through github actions.

Pull Requests must pass testing before being merged.  

## Releasing

releases occur through the github releases mechanism.

The new release commit should be tagged using semver `v<mv>.<sv>.<pv>` and pushed.  
a release should then be created, after which CI/CD will run tests and release to npm.
