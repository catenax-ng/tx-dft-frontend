import { Box, Link } from '@mui/material';
import { Typography } from 'cx-portal-shared-components';

import { customConfig } from '../../utils/customThemeConfig';

function PoweredByMenuItem({ sidebarExpanded }: { sidebarExpanded: boolean }) {
  return (
    <>
      {customConfig.poweredBy.visible ? (
        <Link href={customConfig.poweredBy.redirectUrl} target={customConfig.poweredBy.redirectUrl ? '_blank' : ''}>
          <Box sx={{ display: 'flex', p: 1 }}>
            {customConfig.poweredBy.logoUrl ? <img src={customConfig.poweredBy.logoUrl} alt="logo" width={20} /> : null}
            {sidebarExpanded && customConfig.poweredBy.name ? (
              <Typography
                variant="body2"
                marginLeft={1}
                fontSize={13}
                dangerouslySetInnerHTML={{
                  __html: customConfig.poweredBy.name,
                }}
              ></Typography>
            ) : null}
          </Box>
        </Link>
      ) : null}
    </>
  );
}

export default PoweredByMenuItem;
