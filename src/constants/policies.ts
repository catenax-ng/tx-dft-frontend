import { IDefaultObject } from '../models/Common';
import { ALPHA_NUM_REGEX } from '../utils/constants';

const SELECT_POLICY_TYPES = ['Brands', 'Version', 'Static'];

const ADD_POLICY_DIALOG_TYPES = ['Add', 'FileWithPolicy'];

const POLICY_TYPES: IDefaultObject = {
  Access: 'access_policies',
  Usage: 'usage_policies',
};

const CUSTOM_POLICY_FIELDS = {
  BasicDetails: [
    {
      technicalKey: 'policyName',
      description: 'Policy name',
      value: '',
      attribute: [
        {
          key: 'Regex',
          value: ALPHA_NUM_REGEX,
        },
      ],
    },
  ],
};

export { ADD_POLICY_DIALOG_TYPES, CUSTOM_POLICY_FIELDS, POLICY_TYPES, SELECT_POLICY_TYPES };
