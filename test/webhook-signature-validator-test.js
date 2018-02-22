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
const validator = require('../src/webhook-signature-validator');

describe('webhook-signature-validator', () => {
  const request = {
    headers: {
      'x-nexus-webhook-signature': '42f0ce462b5631af387660d11c7b93a1d8ae209d'
    },
    body: {
      'field': 'value'
    }
  };

  it('should validate a well formed body with signature', () => {
    const secret = 'secret';

    assert.isTrue(validator.validate(request, secret));
  });

  it('should invalidate a well formed body with incorrect signature', () => {
    const secret = 'notsecret';

    assert.isFalse(validator.validate(request, secret));
  });
});