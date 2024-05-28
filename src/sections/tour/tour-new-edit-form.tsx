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
import FormProvider, { RHFTextField } from 'src/components/hook-form';

type Props = {
  currentTour?: any;
};

export default function TourNewEditForm({ currentTour }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewTourSchema = Yup.object().shape({
    name: Yup.string().required('Title is required'),
    location: Yup.string().required('Location is required'),
    price: Yup.string().required('Price is required'),
    description: Yup.string().required('Description is required'),
    start_time: Yup.mixed<any>().nullable().required('Start date is required'),
    end_time: Yup.mixed<any>()
      .required('End date is required')
      .test(
        'date-min',
        'End date must be later than create date',
        (value, { parent }) => value.getTime() > parent.start_time.getTime()
      ),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTour?.name || '',
      location: currentTour?.location || '',
      price: currentTour?.price || '',
      description: currentTour?.description || '',
      start_time: new Date(currentTour?.start_time) || new Date(),
      end_time: new Date(currentTour?.end_time) || null,
    }),
    [currentTour]
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
    if (currentTour) {
      reset(defaultValues);
    }
  }, [currentTour, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let payload = null as any;

      if (currentTour) {
        payload = { ...data, image: currentTour?.image || '', tour_id: currentTour?.tour_id };
      } else {
        payload = {
          ...data,
          image:
            'https://bcp.cdnchinhphu.vn/344443456812359680/2022/12/27/nhattrang3-16721128389061596602579.jpg',
        };
      }

      const response = await axios.post(currentTour ? '/tour/update' : '/tour/create', payload);

      if (response.data.status) {
        reset();
        enqueueSnackbar(currentTour ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.tour.root);
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
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Tour Title" />
            <RHFTextField name="location" label="Location" />
            <RHFTextField type="number" name="price" label="Price" />
            <RHFTextField name="description" label="Description" multiline rows={5} />
            <Controller
              name="start_time"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  label="Date start"
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
            <Controller
              name="end_time"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
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
          {!currentTour ? 'Create Tour' : 'Save Changes'}
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
