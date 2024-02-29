import { ALPHA_NUM_REGEX } from '../utils/constants';

const SELECT_POLICY_TYPES = ['Brands', 'Version', 'Static'];

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
  policyName: '',
  Access: [
    {
      technicalKey: 'BusinessPartnerNumber',
      type: ['Access', 'Usage'],
      description:
        'The business partner number restriction can get used to define which exact business partners (based on BPNL) are allowed to view or negotiate the respective data offer. Please ensure that you add minimum one 16-digit BPNL Number in the rightOperand; wildcards are not supported.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
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
          key: 'Static',
          value: 'active',
        },
      ],
      technicalEnforced: true,
      value: {
        index: 0,
        key: 'Static',
        value: 'active',
      },
    },
    {
      technicalKey: 'companyRole.dismantler',
      type: ['Access', 'Usage'],
      description:
        'Company role defining a dismantler. Companies holding the credential are dismantler certified companies.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
          key: 'Brands',
          value: 'VW',
        },
        {
          key: 'Brands',
          value: 'BMW',
        },
        {
          key: 'Brands',
          value: 'Audi',
        },
      ],
      technicalEnforced: true,
      value: {
        index: 2,
        key: 'Brands',
        value: 'Audi',
      },
    },
  ],
  Usage: {
    BusinessPartnerNumber: {
      technicalKey: 'BusinessPartnerNumber',
      type: ['Access', 'Usage'],
      description:
        'The business partner number restriction can get used to define which exact business partners (based on BPNL) are allowed to view or negotiate the respective data offer. Please ensure that you add minimum one 16-digit BPNL Number in the rightOperand; wildcards are not supported.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
          key: 'Regex',
          value: '^BPNL[\\w|\\d]{12}$',
        },
      ],
      technicalEnforced: true,
      value: 'BPNL001000TS0100',
    },
    Membership: {
      technicalKey: 'Membership',
      type: ['Access', 'Usage'],
      description:
        'The membership credential can get used to ensure that only CX members are allowed to view or negotiate the respective data offer.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
          key: 'Static',
          value: 'active',
        },
      ],
      technicalEnforced: true,
      value: {
        index: 0,
        key: 'Static',
        value: 'active',
      },
    },
    'FrameworkAgreement.traceability': {
      technicalKey: 'FrameworkAgreement.traceability',
      type: ['Usage'],
      description:
        'With the Framework Credential, only those participants which have signed the respective framework agreement (general or via a specific version) are allowed to view or negotiate the respective data offer. Generic: "rightOperand": "active"; specific "rightOperand": "active:{version}"',
      useCase: ['Traceability'],
      attribute: [
        {
          key: 'Version',
          value: '1.0',
        },
        {
          key: 'Version',
          value: '1.1',
        },
        {
          key: 'Version',
          value: '1.2',
        },
      ],
      technicalEnforced: true,
      value: {
        index: 2,
        key: 'Version',
        value: '1.2',
      },
    },
    'FrameworkAgreement.quality': {
      technicalKey: 'FrameworkAgreement.quality',
      type: ['Usage'],
      description:
        'With the Framework Credential, only those participants which have signed the respective framework agreement (general or via a specific version) are allowed to view or negotiate the respective data offer. Generic: "rightOperand": "active"; specific "rightOperand": "active:{version}"',
      useCase: ['Quality'],
      attribute: [
        {
          key: 'Version',
          value: '1.0',
        },
      ],
      technicalEnforced: true,
      value: {
        index: 0,
        key: 'Version',
        value: '1.0',
      },
    },
    'FrameworkAgreement.pcf': {
      technicalKey: 'FrameworkAgreement.pcf',
      type: ['Usage'],
      description:
        'With the Framework Credential, only those participants which have signed the respective framework agreement (general or via a specific version) are allowed to view or negotiate the respective data offer. Generic: "rightOperand": "active"; specific "rightOperand": "active:{version}"',
      useCase: ['PCF'],
      attribute: [
        {
          key: 'Version',
          value: '1.0',
        },
      ],
      technicalEnforced: true,
      value: {
        index: 0,
        key: 'Version',
        value: '1.0',
      },
    },
    'FrameworkAgreement.behavioraltwin': {
      technicalKey: 'FrameworkAgreement.behavioraltwin',
      type: ['Usage'],
      description:
        'With the Framework Credential, only those participants which have signed the respective framework agreement (general or via a specific version) are allowed to view or negotiate the respective data offer. Generic: "rightOperand": "active"; specific "rightOperand": "active:{version}"',
      useCase: ['Behavioraltwin'],
      attribute: [
        {
          key: 'Version',
          value: '1.0',
        },
      ],
      technicalEnforced: true,
      value: {
        index: 0,
        key: 'Version',
        value: '1.0',
      },
    },
    'purpose.trace.v1.TraceBattery': {
      technicalKey: 'purpose.trace.v1.TraceBattery',
      type: ['Usage'],
      description:
        'Facilitating compliance with mandatory regulatory requirements for tracking and reporting battery cells, modules & high-voltage batteries.',
      useCase: ['Traceability'],
      attribute: [
        {
          key: 'Static',
          value: 'purpose.trace.v1.TraceBattery',
        },
      ],
      technicalEnforced: false,
      value: {
        index: 0,
        key: 'Static',
        value: 'purpose.trace.v1.TraceBattery',
      },
    },
    'purpose.trace.v1.aspects': {
      technicalKey: 'purpose.trace.v1.aspects',
      type: ['Usage'],
      description:
        'Establishing a digital representation of the automotive supply chain to enable a component specific data exchange.',
      useCase: ['Traceability'],
      attribute: [
        {
          key: 'Static',
          value: 'purpose.trace.v1.aspects',
        },
      ],
      technicalEnforced: false,
      value: '',
    },
    'purpose.trace.v1.qualityanalysis': {
      technicalKey: 'purpose.trace.v1.qualityanalysis',
      type: ['Usage'],
      description:
        ' The data can be used for quality analysis to identify and select affected components and to send quality notifications to affected customers or suppliers.',
      useCase: ['Traceability'],
      attribute: [
        {
          key: 'Static',
          value: 'purpose.trace.v1.qualityanalysis',
        },
      ],
      technicalEnforced: false,
      value: {
        index: 0,
        key: 'Static',
        value: 'purpose.trace.v1.qualityanalysis',
      },
    },
    'companyRole.dismantler': {
      technicalKey: 'companyRole.dismantler',
      type: ['Access', 'Usage'],
      description:
        'Company role defining a dismantler. Companies holding the credential are dismantler certified companies.',
      useCase: ['Traceability', 'Quality', 'PCF', 'Behavioraltwin', 'Sustainability'],
      attribute: [
        {
          key: 'Brands',
          value: 'VW',
        },
        {
          key: 'Brands',
          value: 'BMW',
        },
        {
          key: 'Brands',
          value: 'Audi',
        },
      ],
      technicalEnforced: true,
      value: {
        index: 1,
        key: 'Brands',
        value: 'BMW',
      },
    },
    purpose: {
      technicalKey: 'purpose',
      type: ['Usage'],
      description: '',
      useCase: ['Traceability'],
      attribute: [
        {
          key: 'Static',
          value: 'ID Trace 3.1',
        },
      ],
      technicalEnforced: false,
      value: {
        index: 0,
        key: 'Static',
        value: 'ID Trace 3.1',
      },
    },
  },
};

export { CUSTOM_POLICY_FIELDS, EDIT_SAMPLE_DATA, SELECT_POLICY_TYPES };
