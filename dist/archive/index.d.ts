import SearchRequest from "./search-request";
import SearchResult from "./search-result";
import Order from "../orders/order";
import OrderRequest from "./order-request";
import { AxiosInstance } from "axios";
export default class Archive {
    private _client;
    constructor(client: AxiosInstance);
    Search(req: SearchRequest): Promise<SearchResult[]>;
    Order(req: OrderRequest): Promise<Order>;
}
