import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import axios from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFEditor, RHFTextField } from 'src/components/hook-form';

type Props = {
  currentPost?: any;
};

export default function PostNewEditForm({ currentPost }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewBlogSchema = Yup.object().shape({
    name: Yup.string().required('Title is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Description is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentPost?.title || '',
      location: currentPost?.location || '',
      description: currentPost?.description || '',
    }),
    [currentPost]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let payload = null as any;

      if (currentPost) {
        payload = { ...data, image: '', advertise_id: currentPost?.advertise_id };
      } else {
        payload = {
          ...data,
          image: '',
        };
      }

      const response = await axios.post(
        currentPost ? '/advertise/update' : '/advertise/create',
        payload
      );

      if (response.data.status) {
        reset();
        enqueueSnackbar(currentPost ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.post.root);
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
            <RHFTextField name="name" label="Post Title" />
            <RHFTextField name="location" label="Location" />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFEditor simple name="description" />
            </Stack>
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
          {!currentPost ? 'Create Post' : 'Save Changes'}
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
