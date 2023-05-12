import { theme as CxTheme } from 'cx-portal-shared-components';
import { merge } from 'lodash';

import { customConfig } from './customThemeConfig';

export const sdeTheme = merge(CxTheme, customConfig.theme);
