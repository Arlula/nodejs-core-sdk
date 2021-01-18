import Order from "./order";
import { AxiosInstance } from "axios";
export default class Orders {
    private _client;
    constructor(client: AxiosInstance);
    ListOrders(): Promise<Order[]>;
    GetOrder(id: string): Promise<Order>;
    downloadResource(id: string): Promise<ArrayBuffer>;
}
