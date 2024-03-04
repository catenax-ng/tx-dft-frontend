/* eslint-disable @typescript-eslint/no-explicit-any */

import { capitalize, find, isObject, merge } from 'lodash';

import { PolicyHubResponse } from '../features/provider/policies/types';

export class PolicyHubModel {
  static convert(jsonData: PolicyHubResponse[]) {
    const fullPolicyData: any = {};
    jsonData.forEach(obj => {
      obj.type.forEach(type => {
        if (!fullPolicyData[type]) {
          fullPolicyData[type] = [];
        }
        fullPolicyData[type].push({
          ...obj,
          value: '',
          attribute: obj.attribute.map((el: any, index: number) => {
            return { index, ...el };
          }),
        });
      });
    });
    return { ...fullPolicyData, policy_name: '' };
  }

  static usecaseFilter(jsonData: PolicyHubResponse[], selectedUseCases?: string[]) {
    const filteredData = jsonData.filter(obj =>
      selectedUseCases.some(useCase => obj.useCase.includes(capitalize(useCase))),
    );
    return PolicyHubModel.convert(filteredData);
  }

  static preparePayload(formData: any) {
    const payload: any = {};

    for (const [type, policyType] of Object.entries(formData)) {
      if (Array.isArray(policyType)) {
        payload[type] = policyType.map((policy: any) => ({
          ...policy,
          value: [isObject(policy.value) ? policy.value.value : policy.value],
        }));
      } else {
        payload[type] = policyType;
      }
    }
    return payload;
  }

  static prepareEditData(targetObject: any, baseData: any) {
    const sourceObject = PolicyHubModel.convert(baseData);
    const targetClone = { ...targetObject };

    const handleFieldValues = (policies: any[]) => {
      return policies.map((policy: PolicyHubResponse) => ({
        ...policy,
        value: find(policy.attribute, { value: policy.value[0] }) || policy.value[0],
      }));
    };

    for (const fieldName in targetClone) {
      if (Array.isArray(targetClone[fieldName])) {
        // Assuming technicalKey is the common field in all policies
        const technicalKeyField = 'technicalKey';
        const policySet = new Set(targetClone[fieldName].map((policy: PolicyHubResponse) => policy[technicalKeyField]));
        const filteredPolicies: PolicyHubResponse[] = sourceObject[fieldName].filter((policy: PolicyHubResponse) =>
          policySet.has(policy[technicalKeyField]),
        );
        const mergedPolicies = merge(filteredPolicies, targetClone[fieldName]);
        targetClone[fieldName] = handleFieldValues(mergedPolicies);
      }
    }
    return targetClone;
  }
}
