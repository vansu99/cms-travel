import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import BookingNewEditForm from '../booking-new-edit-form';
// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function TourEditView({ id }: Props) {
  const settings = useSettingsContext();

  const [currentBooking, setCurrentBooking] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    async function getDetail() {
      try {
        const response = await axios.post('/tour-regis/detail', { id });
        setCurrentBooking(response.data.data);
      } catch (error) {
        return error;
      }
    }

    getDetail();
  }, [id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Detail"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Tour',
            href: paths.dashboard.tour.root,
          },
          { name: 'Detail' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentBooking?.tour_regis_id ? (
        <BookingNewEditForm currentBooking={currentBooking} />
      ) : (
        <div>Loading</div>
      )}
    </Container>
  );
}
