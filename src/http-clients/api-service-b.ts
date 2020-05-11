import { BaseHttpclient } from "./base-httpclient";
import { SERVICE_HOST } from "../util/secrets";

export default new BaseHttpclient(
    `http://${SERVICE_HOST}:3002`,
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
);