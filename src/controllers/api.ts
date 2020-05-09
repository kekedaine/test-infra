"use strict";

import { Response, Request, NextFunction } from "express";
import ApiServiceB from "../http-clients/api-service-b"
import ApiServiceC from "../http-clients/api-service-c"
import Blurbird from "bluebird"
import { SERVICE_NAME, PORT } from "../util/secrets"
import axios from "axios"
import _ from "lodash"

var agent = require('elastic-apm-node').start({
    serviceName: SERVICE_NAME,
    serverUrl: 'http://localhost:8200',
})
const opentracing = require('elastic-apm-node-opentracing')
var opentracingOrg = require('opentracing')

const tracer = new opentracing(agent)

function getCarrier(span: any, tracer: any) {
    console.log('run getCarrier');
    const carrier = {}
    tracer.inject(span.context(), opentracingOrg.FORMAT_HTTP_HEADERS, carrier)
    console.log('carrier = ', carrier);
    return carrier
}

function createContinuationSpan(tracer: any, req: any, spanName: any) {
    const incomingSpanContext = tracer.extract(opentracingOrg.FORMAT_HTTP_HEADERS, req.headers)
    if (incomingSpanContext == null) {
        console.log('createContinuationSpan > start new');
        return tracer.startSpan(spanName)
    }else{
        console.log('createContinuationSpan > extract from Request');
    }
    return tracer.startSpan(spanName, {childOf: incomingSpanContext})
}


/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response) => {
    res.json({ status: "success", message: "hello from service" });
};

export const getServiceInfo = async (req: Request, res: Response) => {
    console.log(`getServiceInfo from: ${SERVICE_NAME}`);
    const getServiceInfospan = createContinuationSpan(tracer, req, 'getServiceInfo')
    await Blurbird.delay(_.random(100, 1000, false))
    res.json({
        status: "success",
        message: "hello word",
        data: {
            name: SERVICE_NAME,
            port: PORT
        }
    });
    getServiceInfospan.finish()
    console.log(`FINISH getServiceInfo from: ${SERVICE_NAME}`);
};


export const callRequestToServiceB = async (req: Request, res: Response) => {
    const span = tracer.startSpan(`callRequestToServiceB`)
    await Blurbird.delay(_.random(100, 500, false))
    let result = await ApiServiceB.get(
        '/info',
        undefined,
        {
            headers: getCarrier(span, tracer)
        }
    )

    res.json({ status: "success", message: "callRequestToServiceB", result: result });

    await Blurbird.delay(_.random(50, 300, false))
    span.finish()
};


export const callRequestToServiceC = async (req: Request, res: Response) => {
    const span = tracer.startSpan(`callRequestToServiceC`)
    await Blurbird.delay(_.random(100, 500, false))
    let result = await ApiServiceC.get(
        '/info',
        undefined,
        {
            headers: getCarrier(span, tracer)
        }
    )

    res.json({ status: "success", message: "callRequestToServiceC", result: result });

    await Blurbird.delay(_.random(50, 300, false))
    span.finish()
};
