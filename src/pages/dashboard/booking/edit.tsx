import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { BookingEditView } from 'src/sections/booking/view';

// ----------------------------------------------------------------------

export default function BookingEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Booking Edit</title>
      </Helmet>

      <BookingEditView id={`${id}`} />
    </>
  );
}
