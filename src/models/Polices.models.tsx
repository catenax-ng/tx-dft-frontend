/* eslint-disable @typescript-eslint/no-explicit-any */

import { capitalize, find, isObject, merge } from 'lodash';

import { POLICY_TYPES } from '../constants/policies';
import { PolicyHubResponse } from '../features/provider/policies/types';

export class PolicyHubModel {
  static convert(jsonData: PolicyHubResponse[]) {
    const fullPolicyData: any = {};
    jsonData.forEach(obj => {
      obj.type.forEach(type => {
        const newType = POLICY_TYPES[type];
        if (!fullPolicyData[newType]) {
          fullPolicyData[newType] = [];
        }
        fullPolicyData[newType].push({
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

    const handleFieldValues = (policies: any) => {
      return policies.map((policy: any) => ({
        ...policy,
        value: find(policy.attribute, { value: policy.value[0] }) || policy.value[0],
      }));
    };

    const accessPoliciesSet = new Set(targetClone.access_policies.map((policy: any) => policy.technicalKey));
    const usagePoliciesSet = new Set(targetClone.usage_policies.map((policy: any) => policy.technicalKey));

    const accessPolices: any = sourceObject.access_policies
      .filter((policy: any) => accessPoliciesSet.has(policy.technicalKey))
      .map((policy: any) => ({
        ...policy,
        value: find(policy.attribute, { value: policy.value[0] }) || policy.value[0],
      }));

    const usagePolicies: any = sourceObject.usage_policies
      .filter((policy: any) => usagePoliciesSet.has(policy.technicalKey))
      .map((policy: any) => ({
        ...policy,
        value: find(policy.attribute, { value: policy.value[0] }) || policy.value[0],
      }));

    const mergedObject: any = merge({ access_policies: accessPolices, usage_policies: usagePolicies }, targetClone);
    const finalObject = {
      ...mergedObject,
      access_policies: handleFieldValues(mergedObject.access_policies),
      usage_policies: handleFieldValues(mergedObject.usage_policies),
    };
    return finalObject;
  }
}
