import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TourNewEditForm from '../tour-new-edit-form';
// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function TourEditView({ id }: Props) {
  const settings = useSettingsContext();

  const [currentTour, setCurrentTour] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    async function getDetail() {
      try {
        const response = await axios.post('/tour/detail', { id });
        setCurrentTour(response.data.data);
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
            name: 'Tour',
            href: paths.dashboard.tour.root,
          },
          { name: currentTour?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentTour?.tour_id ? <TourNewEditForm currentTour={currentTour} /> : <div>Loading</div>}
    </Container>
  );
}
