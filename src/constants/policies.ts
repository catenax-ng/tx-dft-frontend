import { ALPHA_NUM_REGEX } from '../utils/constants';

const SELECT_POLICY_TYPES = ['Brands', 'Version', 'Static'];

const CUSTOM_POLICY_FIELDS = {
  Generic: {
    policyName: {
      technicalKey: 'policyName',
      type: ['Generic'],
      value: '',
      attribute: [
        {
          key: 'Regex',
          value: ALPHA_NUM_REGEX,
        },
      ],
    },
  },
};

export { CUSTOM_POLICY_FIELDS, SELECT_POLICY_TYPES };
