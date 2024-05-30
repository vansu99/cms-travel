import { Helmet } from 'react-helmet-async';

import { BookingListView } from 'src/sections/booking/view';

export default function BookingListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Booking List</title>
      </Helmet>

      <BookingListView />
    </>
  );
}
