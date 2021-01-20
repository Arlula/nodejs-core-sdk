import { AxiosError } from "axios";
/**
 * Return server error string for normal errors
 * and the axios error for transport errors
 * @param {AxiosError} e The error returned by the request in its catch block
 * @returns {Promise<never>} a rejected promise containing either the error string, or the axios error
 */
export declare function handleError(e: AxiosError): Promise<never>;
