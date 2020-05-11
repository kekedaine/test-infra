import { BaseHttpclient } from "./base-httpclient";
import { SERVICE_HOST } from "../util/secrets";

export default new BaseHttpclient(
    `http://${SERVICE_HOST}:3003`,
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
);