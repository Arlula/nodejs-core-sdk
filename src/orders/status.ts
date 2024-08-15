
/**
 * OrderStatus enumerates the statuses that orders may be in
 * 
 * New ------------> "created",
 * Pending --------> "pending",
 * Processing -----> "processing",
 * Manual ---------> "manual",
 * PostProcessing -> "post-processing",
 * Complete -------> "complete",
 */
export enum StatusCode {
    // common + archive orders
    New             = "created",
    Pending         = "pending",
    Processing      = "processing",
    PostProcessing  = "post-processing",
    Complete        = "complete",
    // custom orders
    Manual           = "manual",
    PendingScreening = "pending-screen",
    // tasking orders
    PendingApproval = "pending-approval",
    Rejected        = "rejected",
    Failed          = "failed",
    Rescheduled     = "rescheduled",
    Cancelled       = "cancelled"
}

export function isStatusCode(token: string): token is StatusCode {
    return Object.values(StatusCode).includes(token as StatusCode);
}
