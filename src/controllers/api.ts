"use strict";

import { Response, Request, NextFunction } from "express";
import ApiServiceB from "../http-clients/api-service-b"
import ApiServiceC from "../http-clients/api-service-c"
import Blurbird from "bluebird"
import { SERVICE_NAME, PORT, SERVICE_HOST } from "../util/secrets"
import _ from "lodash"
import logger from "../util/logger"

var agent = require('elastic-apm-node').start({
    serviceName: SERVICE_NAME,
    secretToken: 'C5VSwgXztUO2J68cPY6F85n1PxGTsOYR',
    serverUrl: `http://${SERVICE_HOST}:8200`,
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
    } else {
        console.log('createContinuationSpan > extract from Request');
    }
    return tracer.startSpan(spanName, { childOf: incomingSpanContext })
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
    logger.info(`getServiceInfo from: ${SERVICE_NAME} - ${new Date().getTime()}`, { cheese: 'gouda', biscuits: 'hobnob' });
    const span = createContinuationSpan(tracer, req, 'getServiceInfo')
    await Blurbird.delay(_.random(100, 1000, false))
    res.json({
        status: "success",
        message: "hello word",
        ...(req.query && { query: req.query }),
        data: {
            name: SERVICE_NAME,
            port: PORT
        }
    });
    span.finish()
    console.log(`FINISH getServiceInfo from: ${SERVICE_NAME}`);
};

export const callRequestFromUrl = async (req: Request, res: Response) => {
    console.log(`callRequestFromUrl from: ${SERVICE_NAME}`);
    const url = req.query.url
    if (!_.isString(url)) return res.status(404).json({ status: "fail", message: "invalid url" });
    const span = createContinuationSpan(tracer, req, 'callRequestFromUrl')
    let result = await ApiServiceB.get(
        url,
        undefined,
        {
            headers: getCarrier(span, tracer)
        }
    )

    res.json({
        status: "success",
        message: `callRequestFromUrl from: ${SERVICE_NAME}`,
        url,
        result: result
    });
    span.finish()
};

export const callRequestToServiceB = async (req: Request, res: Response) => {
    console.log(`callRequestToServiceB from: ${SERVICE_NAME}`);
    const span = createContinuationSpan(tracer, req, 'callRequestToServiceB')
    await Blurbird.delay(_.random(100, 1000, false))
    let result = await ApiServiceB.get(
        '/info',
        undefined,
        {
            headers: getCarrier(span, tracer)
        }
    )

    res.json({ status: "success", message: `callRequestToServiceB from: ${SERVICE_NAME}`, result: result });
    span.finish()
};

export const callRequestToServiceC = async (req: Request, res: Response) => {
    console.log(`callRequestToServiceC from: ${SERVICE_NAME}`);
    const span = createContinuationSpan(tracer, req, 'callRequestToServiceC')
    await Blurbird.delay(_.random(100, 1000, false))
    let result = await ApiServiceC.get(
        '/info',
        undefined,
        {
            headers: getCarrier(span, tracer)
        }
    )
    res.json({ status: "success", message: `callRequestToServiceC from: ${SERVICE_NAME}`, result: result });
    span.finish()
};
