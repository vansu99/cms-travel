import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();
  const [detail, setDetail] = useState<any>({});

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    async function getDetail() {
      try {
        const response = await axios.post('/customer/detail', { id });
        setDetail(response.data.data);
      } catch (error) {
        return error;
      }
    }

    getDetail();
  }, [id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: detail?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {detail?.customer_id ? <UserNewEditForm currentUser={detail} /> : <div>Loading</div>}
    </Container>
  );
}
