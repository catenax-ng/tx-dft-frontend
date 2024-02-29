/* eslint-disable @typescript-eslint/no-explicit-any */

import { capitalize } from 'lodash';

import { PolicyHubResponse } from '../features/provider/policies/types';

export class AddPolicyModel {
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
    return fullPolicyData;
  }

  static usecaseFilter(jsonData: PolicyHubResponse[], selectedUseCases?: string[]) {
    const filteredData = jsonData.filter(obj =>
      selectedUseCases.some(useCase => obj.useCase.includes(capitalize(useCase))),
    );
    return AddPolicyModel.convert(filteredData);
  }
}
