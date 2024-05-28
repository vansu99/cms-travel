import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import axios from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function AccountGeneral() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues: {
      name: user?.name,
      phone: user?.phone_number,
      email: user?.email,
      username: user?.user_name,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.post('/customer/update', {
        ...data,
        customer_id: user?.customer_id,
      });
      if (response.data?.status) {
        enqueueSnackbar('Update success!');
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {user?.customer_id ? (
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="name" label="Name" />
                <RHFTextField name="email" label="Email Address" />
                <RHFTextField name="phone" label="Phone Number" />
                <RHFTextField name="username" label="User name" />
              </Box>

              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          ) : (
            <div>Loading...</div>
          )}
        </Grid>
      </Grid>
    </FormProvider>
  );
}
