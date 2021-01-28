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
To test, a credentials.ts file needs to be created at `e2e/credentials.ts` which should export the following:
 - `Key` and `Secret` corresponding to the API Key and Secret.
 - `orderingID` being a search result `id` value to test ordering
 - `orderEULA` which contains the corresponding EULA to the above ID
 - `orderID` which contains the order to load in get order tests
 - `resourceID` the id of a resource to load for resource download tests
