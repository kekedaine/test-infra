import { BaseHttpclient } from "./base-httpclient";

export default new BaseHttpclient(
    "http://localhost:3002",
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
);