/*
 * Copyright (c) 2018-present Sonatype, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {IncomingWebhook} = require('@slack/client');
const validator = require('./src/webhook-signature-validator');
const mapper = require('./src/policy-evaluation-mapper');

app.use(bodyParser.json({strict: false}));

app.post('/', function(req, res) {
  if (!validator.validate(req, process.env.IQ_SECRET_KEY)) {
    res.status(401).send({error: 'Not authorized'});
    return;
  }
  const iqNotification = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  const message = mapper.map(req.body);
  iqNotification.send(message, (error, resp) => {
    if (error) {
      console.error(error);
      res.status(500).send({error: error});
      return;
    }
    res.send('');
  });
});

module.exports.handler = serverless(app);
