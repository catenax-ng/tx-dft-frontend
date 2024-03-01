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

const EDIT_SAMPLE_DATA = {
  policyName: 'Hey there',
  access_policies: [
    {
      technicalKey: 'BusinessPartnerNumber',
      type: ['Access', 'Usage'],
      description:
        'The business partner number restriction can get used to define which exact business partners (based on BPNL) are allowed to view or negotiate the respective data offer. Please ensure that you add minimum one 16-digit BPNL Number in the rightOperand; wildcards are not supported.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
          index: 0,
          key: 'Regex',
          value: '^BPNL[\\w|\\d]{12}$',
        },
      ],
      technicalEnforced: true,
      value: '',
    },
    {
      technicalKey: 'Membership',
      type: ['Access', 'Usage'],
      description:
        'The membership credential can get used to ensure that only CX members are allowed to view or negotiate the respective data offer.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
          index: 0,
          key: 'Static',
          value: 'active',
        },
      ],
      technicalEnforced: true,
      value: '',
    },
    {
      technicalKey: 'companyRole.dismantler',
      type: ['Access', 'Usage'],
      description:
        'Company role defining a dismantler. Companies holding the credential are dismantler certified companies.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
          index: 0,
          key: 'Brands',
          value: 'VW',
        },
        {
          index: 1,
          key: 'Brands',
          value: 'BMW',
        },
        {
          index: 2,
          key: 'Brands',
          value: 'Audi',
        },
      ],
      technicalEnforced: true,
      value: '',
    },
  ],
  usage_policies: [
    {
      technicalKey: 'BusinessPartnerNumber',
      type: ['Access', 'Usage'],
      description:
        'The business partner number restriction can get used to define which exact business partners (based on BPNL) are allowed to view or negotiate the respective data offer. Please ensure that you add minimum one 16-digit BPNL Number in the rightOperand; wildcards are not supported.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
          index: 0,
          key: 'Regex',
          value: '^BPNL[\\w|\\d]{12}$',
        },
      ],
      technicalEnforced: true,
      value: '',
    },
    {
      technicalKey: 'Membership',
      type: ['Access', 'Usage'],
      description:
        'The membership credential can get used to ensure that only CX members are allowed to view or negotiate the respective data offer.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
          index: 0,
          key: 'Static',
          value: 'active',
        },
      ],
      technicalEnforced: true,
      value: '',
    },
    {
      technicalKey: 'FrameworkAgreement.traceability',
      type: ['Usage'],
      description:
        'With the Framework Credential, only those participants which have signed the respective framework agreement (general or via a specific version) are allowed to view or negotiate the respective data offer. Generic: "rightOperand": "active"; specific "rightOperand": "active:{version}"',
      useCase: ['Traceability'],
      attribute: [
        {
          index: 0,
          key: 'Version',
          value: '1.0',
        },
        {
          index: 1,
          key: 'Version',
          value: '1.1',
        },
        {
          index: 2,
          key: 'Version',
          value: '1.2',
        },
      ],
      technicalEnforced: true,
      value: '',
    },
    {
      technicalKey: 'FrameworkAgreement.quality',
      type: ['Usage'],
      description:
        'With the Framework Credential, only those participants which have signed the respective framework agreement (general or via a specific version) are allowed to view or negotiate the respective data offer. Generic: "rightOperand": "active"; specific "rightOperand": "active:{version}"',
      useCase: ['Quality'],
      attribute: [
        {
          index: 0,
          key: 'Version',
          value: '1.0',
        },
      ],
      technicalEnforced: true,
      value: '',
    },
    {
      technicalKey: 'FrameworkAgreement.pcf',
      type: ['Usage'],
      description:
        'With the Framework Credential, only those participants which have signed the respective framework agreement (general or via a specific version) are allowed to view or negotiate the respective data offer. Generic: "rightOperand": "active"; specific "rightOperand": "active:{version}"',
      useCase: ['PCF'],
      attribute: [
        {
          index: 0,
          key: 'Version',
          value: '1.0',
        },
      ],
      technicalEnforced: true,
      value: '',
    },
    {
      technicalKey: 'FrameworkAgreement.behavioraltwin',
      type: ['Usage'],
      description:
        'With the Framework Credential, only those participants which have signed the respective framework agreement (general or via a specific version) are allowed to view or negotiate the respective data offer. Generic: "rightOperand": "active"; specific "rightOperand": "active:{version}"',
      useCase: ['Behavioraltwin'],
      attribute: [
        {
          index: 0,
          key: 'Version',
          value: '1.0',
        },
      ],
      technicalEnforced: true,
      value: '',
    },
    {
      technicalKey: 'purpose.trace.v1.TraceBattery',
      type: ['Usage'],
      description:
        'Facilitating compliance with mandatory regulatory requirements for tracking and reporting battery cells, modules & high-voltage batteries.',
      useCase: ['Traceability'],
      attribute: [
        {
          index: 0,
          key: 'Static',
          value: 'purpose.trace.v1.TraceBattery',
        },
      ],
      technicalEnforced: false,
      value: '',
    },
    {
      technicalKey: 'purpose.trace.v1.aspects',
      type: ['Usage'],
      description:
        'Establishing a digital representation of the automotive supply chain to enable a component specific data exchange.',
      useCase: ['Traceability'],
      attribute: [
        {
          index: 0,
          key: 'Static',
          value: 'purpose.trace.v1.aspects',
        },
      ],
      technicalEnforced: false,
      value: '',
    },
    {
      technicalKey: 'purpose.trace.v1.qualityanalysis',
      type: ['Usage'],
      description:
        ' The data can be used for quality analysis to identify and select affected components and to send quality notifications to affected customers or suppliers.',
      useCase: ['Traceability'],
      attribute: [
        {
          index: 0,
          key: 'Static',
          value: 'purpose.trace.v1.qualityanalysis',
        },
      ],
      technicalEnforced: false,
      value: '',
    },
    {
      technicalKey: 'companyRole.dismantler',
      type: ['Access', 'Usage'],
      description:
        'Company role defining a dismantler. Companies holding the credential are dismantler certified companies.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
          index: 0,
          key: 'Brands',
          value: 'VW',
        },
        {
          index: 1,
          key: 'Brands',
          value: 'BMW',
        },
        {
          index: 2,
          key: 'Brands',
          value: 'Audi',
        },
      ],
      technicalEnforced: true,
      value: '',
    },
    {
      technicalKey: 'purpose',
      type: ['Usage'],
      description: '',
      useCase: ['Traceability'],
      attribute: [
        {
          index: 0,
          key: 'Static',
          value: 'ID Trace 3.1',
        },
      ],
      technicalEnforced: false,
      value: '',
    },
  ],
};

export { ADD_POLICY_DIALOG_TYPES, CUSTOM_POLICY_FIELDS, EDIT_SAMPLE_DATA, POLICY_TYPES, SELECT_POLICY_TYPES };
