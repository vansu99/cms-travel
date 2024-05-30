import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { TourDetailsView } from 'src/sections/tour/view';

// ----------------------------------------------------------------------

export default function BookingDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Analytics</title>
      </Helmet>

      <TourDetailsView id={`${id}`} />
    </>
  );
}
