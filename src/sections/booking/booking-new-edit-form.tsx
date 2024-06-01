/* eslint-disable no-nested-ternary */
import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import axios from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

type Props = {
  currentBooking?: any;
};

const statusList = [
  {
    label: 'Done',
    value: 'DONE',
  },
  {
    label: 'Waiting',
    value: 'WAITING',
  },
  {
    label: 'Cancel',
    value: 'CANCELLED',
  },
];

export default function TourNewEditForm({ currentBooking }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewTourSchema = Yup.object().shape({
    customer_name: Yup.string(),
    location: Yup.string(),
    price: Yup.string(),
    tour_name: Yup.string(),
    phone_number: Yup.string(),
    email: Yup.string(),
    start_time: Yup.mixed<any>(),
    end_time: Yup.mixed<any>(),
    status: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      customer_name: currentBooking?.customer?.name || '',
      location: currentBooking?.tour?.location || '',
      tour_name: currentBooking?.tour?.name || '',
      phone_number: currentBooking?.customer?.phone_number || '',
      email: currentBooking?.customer?.email || '',
      price: currentBooking?.price || '',
      start_time: new Date(currentBooking?.start_date) || new Date(),
      end_time: new Date(currentBooking?.end_date) || null,
      status: currentBooking?.status || statusList[1].value,
    }),
    [currentBooking]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewTourSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentBooking) {
      reset(defaultValues);
    }
  }, [currentBooking, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let payload = null as any;

      if (currentBooking) {
        if (data?.status === 'CANCELLED') {
          payload = {
            status: data?.status,
            id: currentBooking?.tour_regis_id,
            customer_id: currentBooking?.customer?.customer_id,
          };
        } else {
          payload = { status: data?.status, id: currentBooking?.tour_regis_id };
        }
      } else {
        payload = {
          ...data,
        };
      }

      const uriPost = currentBooking
        ? data?.status === 'CANCELLED'
          ? '/tour-regis/cancel'
          : '/tour-regis/update-status'
        : '/tour-regis/create';

      const response = await axios.post(uriPost, payload);

      if (response.data.status) {
        reset();
        enqueueSnackbar(currentBooking ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.booking.root);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, ...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="customer_name" label="Customer name" disabled />
            <RHFTextField name="phone_number" label="Customer phone number" disabled />
            <RHFTextField name="email" label="Customer mail" disabled />
            <RHFTextField name="tour_name" label="Tour name" disabled />
            <RHFTextField name="location" label="Tour location" disabled />
            <RHFTextField type="number" name="price" label="Price" disabled />
            <Controller
              name="start_time"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Date start"
                  value={field.value}
                  disabled
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
            <Controller
              name="end_time"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  disabled
                  label="Date end"
                  value={field.value}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
            <RHFSelect
              native
              name="status"
              label="Booking status"
              InputLabelProps={{ shrink: true }}
            >
              {statusList.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </RHFSelect>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentBooking ? 'Create Tour' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
