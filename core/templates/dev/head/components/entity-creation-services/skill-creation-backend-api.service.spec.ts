
// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Unit test for CollectionCreationBackendApiService.
 */

// eslint-disable-next-line max-len
require('components/entity-creation-services/skill-creation-backend-api.service.ts');

import { UpgradedServices } from 'services/UpgradedServices';

fdescribe('Skill Creation backend service', function() {
  var SkillCreationBackendService = null;
  var $httpBackend = null;
  var $rootScope = null;
  var SAMPLE_SKILL_ID = 'hyuy4GUlvTqJ';
  var SUCCESS_STATUS_CODE = 200;
  var ERROR_STATUS_CODE = 500;
  var skillCreationBackendDict = null;
  var rubricDict = null;
  beforeEach(angular.mock.module('oppia'));

  beforeEach(angular.mock.module('oppia', function($provide) {
    var ugs = new UpgradedServices();
    for (let [key, value] of Object.entries(ugs.getUpgradedServices())) {
      $provide.value(key, value);
    }
  }));

  beforeEach(angular.mock.inject(function($injector) {
    SkillCreationBackendService = $injector.get(
      'SkillCreationBackendService');
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');

    rubricDict = {
      difficulty: 'easy',
      explanation: 'test explanation'
    };

    skillCreationBackendDict = {
      description: 'test_des_1',
      linked_topic_ids: 'test_id_11',
      explanation_dict: 'explaination',
      rubrics: rubricDict
    };

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should successfully create a new skill and obtain the skill ID',
    (done) => {
      var successHandler = jasmine.createSpy('success');
      var failHandler = jasmine.createSpy('fail');

      $httpBackend.expectPOST('/skill_editor_handler/create_new', skillCreationBackendDict).respond(
        SUCCESS_STATUS_CODE, {skillId: SAMPLE_SKILL_ID});
        SkillCreationBackendService.createSkill('test_des_1','test_id_11','explaination',rubricDict).then(
        successHandler, failHandler);

      $httpBackend.flush();
      $rootScope.$digest();

      expect(successHandler).toHaveBeenCalled();
      expect(failHandler).not.toHaveBeenCalled();
      done();
    });

  it('should fail to create a new skill and call the fail handler',
    (done) => {
      var successHandler = jasmine.createSpy('success');
      var failHandler = jasmine.createSpy('fail');

      $httpBackend.expectPOST('/skill_editor_handler/create_new',skillCreationBackendDict).respond(
        ERROR_STATUS_CODE);
        SkillCreationBackendService.createSkill('test_des_1','test_id_11','explaination',rubricDict).then(
        successHandler, failHandler);

      $httpBackend.flush();
      $rootScope.$digest();

      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalled();
      done();
    });
});
