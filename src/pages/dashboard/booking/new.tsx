import { Helmet } from 'react-helmet-async';

import { BookingCreateView } from 'src/sections/booking/view';

// ----------------------------------------------------------------------

export default function BookingCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new booking</title>
      </Helmet>

      <BookingCreateView />
    </>
  );
}
