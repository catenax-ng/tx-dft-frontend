/* eslint-disable @typescript-eslint/no-explicit-any */

import { capitalize, isEmpty, isObject } from 'lodash';

import { POLICY_TYPES } from '../constants/policies';
import { PolicyHubResponse } from '../features/provider/policies/types';

export class PolicyHubModel {
  static convert(jsonData: PolicyHubResponse[], targetObject: any) {
    const fullPolicyData: any = {};

    let policyName = '';
    if (!isEmpty(targetObject)) {
      policyName = targetObject.policy_name;
    }

    jsonData.forEach(obj => {
      obj.type.forEach(type => {

        const newType = POLICY_TYPES[type];
        if (!fullPolicyData[newType]) {
          fullPolicyData[newType] = [];
        }
        const calculateOptions = PolicyHubModel.getSelectedValueAndAttibutes(targetObject, newType, obj);

        fullPolicyData[newType].push({
          ...obj,
          value: calculateOptions.selectedValue,
          attribute: calculateOptions.attributes,
        });
      });
    });
    return { ...fullPolicyData, policy_name: policyName };
  }

  static usecaseFilter(jsonData: PolicyHubResponse[], targetObject?: any, selectedUseCases?: string[]) {
    let filteredData = jsonData;
    if (!isEmpty(selectedUseCases)) {
      filteredData = jsonData.filter(obj =>
        selectedUseCases.some(useCase => obj.useCase.includes(capitalize(useCase))),
      );
    }
    return PolicyHubModel.convert(filteredData, targetObject);
  }

  static preparePayload(formData: any) {
    const payload: any = {};

    for (const [type, policyType] of Object.entries(formData)) {
      if (Array.isArray(policyType)) {
        payload[type] = policyType.map((policy: any) => ({
          uuid: policy.id,
          technicalKey: policy.technicalKey,
          value: [isObject(policy.value) ? policy.value.value : policy.value],
        }));
      } else {
        payload[type] = policyType;
      }
    }
    return payload;
  }

  static getSelectedValueAndAttibutes(targetObject: any, newType: string, obj: any) {
    let selectedValue: any;
    if (!isEmpty(targetObject)) {
      const typeVal = targetObject[newType];
      typeVal.filter((selectedOption: any) => {
        if (selectedOption.technicalKey === obj.technicalKey) {
          selectedValue = selectedOption.value[0];
        }
      });
    }
    
    const attributes = obj.attribute.map((el: any, index: number) => {
      if (!isEmpty(selectedValue) && el.value === selectedValue) {
        selectedValue = el;
      }
      return { index, ...el };
    });
    return { attributes: attributes, selectedValue: selectedValue };
  }

}
