"use strict";

import { Response, Request, NextFunction } from "express";
import ApiServiceB from "../http-clients/api-service-b"
import Blurbird from "bluebird"
import { SERVICE_NAME, PORT } from "../util/secrets"
import axios from "axios"

var agent = require('elastic-apm-node').start({
    serviceName: SERVICE_NAME,
    // secretToken: '',
    serverUrl: 'http://localhost:8200',
})
// import * as abc from 'elastic-apm-node-opentracing'
const opentracing = require('elastic-apm-node-opentracing')
var opentracingOrg = require('opentracing')

// agent.init({
//     serviceName: 'my-frontend-app', // Name of your frontend app
//     serverUrl: 'https://example.com:8200', // APM Server host
//     pageLoadTraceId: '${transaction.traceId}',
//     pageLoadSpanId: '${transaction.ensureParentId()}',
//     // pageLoadSampled: ${transaction.sampled}
//   })

const tracer = new opentracing(agent)

function getCarrier(span: any, tracer: any) {
    console.log('run getCarrier');
    const carrier = {}
    // console.log('span = ', span);
    // console.log('tracer = ', tracer);
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

    const parentSpan = createContinuationSpan(tracer, req, 'getServiceInfo')
    const childSpan = tracer.startSpan('getServiceInfoChild', {childOf: parentSpan})

    // const span = tracer.startSpan('getServiceInfo')

    getCarrier(parentSpan, tracer)

    await Blurbird.delay(500)
    res.json({
        status: "success",
        message: "hello word",
        data: {
            name: SERVICE_NAME,
            port: PORT
        }
    });
    childSpan.finish()
    console.log('Finish childSpan');

    parentSpan.finish()
    console.log('Finish parentSpan');
};


export const callRequestToServiceB = async (req: Request, res: Response) => {
    const span = tracer.startSpan(`callRequestToServiceB`)
    await Blurbird.delay(600)
    let result = await ApiServiceB.get(
        '/info',
        undefined,
        {
            headers: getCarrier(span, tracer)
        }
    )

    // const result = await axios.get(`http://localhost:3002/info`, {
    //     headers: getCarrier(span, tracer)
    // })

    res.json({ status: "success", message: "callRequestToServiceB", result: result });

    await Blurbird.delay(200)
    span.finish()
};

