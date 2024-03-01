/* eslint-disable @typescript-eslint/no-explicit-any */

import { capitalize } from 'lodash';

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
          value: [policy.value.value || ''],
        }));
      } else {
        payload[type] = policyType;
      }
    }

    return payload;
  }
}
