## TEST INFRA Microservice

#### RUN
```
docker run --rm -it -e SERVICE_NAME=SERVICE_A -e PORT=3001 -p 3001:3001 --name service_a kekedaine/test-infra
```
#### API:
```
http://localhost:3001/info
http://localhost:3001/call-to-b
http://localhost:3001/call-to-c
```

#### Default port for API:
- Service A- PORT 3001
- Service B- PORT 3002
- Service C- PORT 3003


