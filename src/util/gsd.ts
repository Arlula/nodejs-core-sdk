
/**
 * GroundSampleDistance labels for commonly desired imagery precisions
 * 
 * veryHigh -> 0.5m/pixel or less
 * high -----> 1m/pixel or less
 * medium ---> 5m/pixel or less
 * low ------> 20m/pixel or less
 * veryLow --> 10km/pixel or less (arbitrary large value to return all sources)
 */
export enum GroundSampleDistance {
    veryHigh = 0.5,
    high = 1,
    medium = 5,
    low = 20,
    veryLow = 100000,
}