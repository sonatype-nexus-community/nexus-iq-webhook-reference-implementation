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

const { assert } = require('chai');
const mapper = require('../src/policy-evaluation-mapper')

describe('policy-evaluation-mapper', () => {
  function getPayload(criticalComponentCount) {
    return {
      'applicationEvaluation': {
        'policyEvaluationId': 'debceb1d-9209-485d-8d07-bd5390de7ef5',
        'stage': 'build',
        'ownerId': '6a454175-f55d-4d33-ba44-90ac3af2e8b8',
        'evaluationDate': '2015-05-05T23:40:12Z',
        'affectedComponentCount': 10,
        'criticalComponentCount': criticalComponentCount,
        'severeComponentCount': 5,
        'moderateComponentCount': 3,
        'outcome': 'fail'
      }
    };
  }

  it('should convert policy evaluation webhook to slack message', () => {
    const message = mapper.map(getPayload(2));

    assert.equal(message, 'IQ Policy Eval: 2 Critical Violations');
  });

  it('should convert policy evaluation webhook to slack message, no critical', () => {
    const message = mapper.map(getPayload(0));

    assert.equal(message, 'IQ Policy Eval: Congrats Critical Violation Free!!!!!');
  });
});
