import { BaseHttpclient } from "./base-httpclient";

export default new BaseHttpclient(
    "http://localhost:3003",
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
);