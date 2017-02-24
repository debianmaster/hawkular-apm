/*
 * Copyright 2015-2016 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const express = require('express');
const http = require('http');

const {HttpLogger} = require('zipkin-transport-http');
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const bodyParser = require('body-parser');

const zipkin = require('zipkin');
const {restInterceptor} = require('zipkin-instrumentation-cujojs-rest');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
const CLSContext = require('zipkin-context-cls');

const recorder = new zipkin.BatchRecorder({
    logger: new HttpLogger({
        endpoint: 'http://tracing-server:'+ process.env.TRACING_PORT +'/api/v1/spans'
    })
});

const ctxImpl = new CLSContext('zipkin');
const tracer = new zipkin.Tracer({
    recorder: recorder,
    ctxImpl: ctxImpl,
    sampler: new zipkin.sampler.CountingSampler(1)
});

var app = express();
app.use(bodyParser.json())
   .use(zipkinMiddleware({
       tracer,
       serviceName: 'Node.js',
       port: 3001
}));

const client = rest.wrap(restInterceptor, {tracer, serviceName: 'Node.js'})
    .wrap(mime);

const apiPrefix = '/nodejs';

app.get(apiPrefix + '/hello', function(req, resp) {
    resp.send('Hello from Node.js! [javascript]');
});

app.post(apiPrefix + '/createUser', function (req, resp) {
    let user = req.body;

    // console.log(req);
    //postData(user, 'http://dropwizard:3000/dropwizard/users');
    postData(user, 'http://wildfy-swarm:3003/wildfly-swarm/users');

    console.log('User: ', user, " created!");
    resp.send('Users created!');
});

function postData(user, url) {
    client({path: url,
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        entity: user
    }).then(success => {
        console.log('Got successful response from: ', url);
    }, error => {
        console.error('Error', error);
    });
}

/**
 * Reproducer for https://github.com/openzipkin/zipkin-js/issues/32
 * Some client spans are not being reported.
 *
 * Execute multiple times:
 * curl -ivX GET 'http://localhost:3001/nodejs/clientSpans?n=50'
 *
 * Server should show 1 + n reported spans (1 server span and n client spans)
 */
app.get(apiPrefix + '/clientSpans', function (req, resp) {

    let url = 'https://jsonplaceholder.typicode.com/posts/1';
    let numberOfRequests = req.query.n;

    for (let i = 0; i < numberOfRequests; i++) {
        client({
            method: 'GET',
            path: url,
            entity: 'some data'
        }).then(success => {
            console.log('Got ' + i + ' successful response from ' + url);
        }, error => {
            console.error('Error', error);
        });
    }

    resp.send(numberOfRequests + ' requests to ' + url);
});

var server = app.listen(3001, '0.0.0.0', function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('NodeJS service running at http://', host, ':', port)
});

