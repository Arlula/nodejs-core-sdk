import { AxiosError } from "axios";

export function handleError(e: AxiosError): Promise<never> {
    return Promise.reject(e.response?.data || e);
}