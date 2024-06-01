import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
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
import FormProvider, { RHFEditor, RHFTextField } from 'src/components/hook-form';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { CLOUDINARY_CLOUDNAME, CLOUDINARY_PRESET_KEY } from 'src/config-global';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

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
    price_adult: Yup.string()
      .required('Price adult is required')
      .test('price-number', 'The field is invalid', (value) => Number(value) > 0),
    price_child: Yup.string()
      .required('Price children is required')
      .test('price-number', 'The field is invalid', (value) => Number(value) > 0),
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
      price_adult: currentTour?.price_adult || '',
      price_child: currentTour?.price_child || '',
      description: currentTour?.description || '',
      start_time: new Date(currentTour?.start_time) || new Date(),
      end_time: new Date(currentTour?.end_time) || null,
      image: currentTour?.image || '',
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

  const [file, setFile] = useState<any>();
  const handleFileUpload = (item: any) => {
    setFile(item[0]);
    currentTour = { ...currentTour, image: currentTour?.image };
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(CLOUDINARY_CLOUDNAME);
    const preset_key = 'hz1vxe85';
    const clound_name = 'droaa5vpq';

    if (!file) {
      console.error('Please select a file.');
      return;
    }

    const uniqueUploadId = `uqid-${Date.now()}`;
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const uploadChunk = async (start: any, end: any) => {
      const formData = new FormData();
      formData.append('file', file.slice(start, end));
      formData.append('cloud_name', clound_name);
      formData.append('upload_preset', preset_key);
      const contentRange = `bytes ${start}-${end - 1}/${file.size}`;

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${clound_name}/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'X-Unique-Upload-Id': uniqueUploadId,
            'Content-Range': contentRange,
          },
        });

        if (!response.ok) {
          throw new Error('Chunk upload failed.');
        }

        currentChunk++;

        if (currentChunk < totalChunks) {
          const nextStart = currentChunk * chunkSize;
          const nextEnd = Math.min(nextStart + chunkSize, file.size);
          uploadChunk(nextStart, nextEnd);
        } else {
          const fetchResponse = await response.json();

          let payload = null as any;
          if (currentTour) {
            payload = {
              ...data,
              image: fetchResponse.secure_url || '',
              tour_id: currentTour?.tour_id,
            };
          } else {
            payload = {
              ...data,
              image: fetchResponse.secure_url,
            };
          }

          const res = await axios.post(currentTour ? '/tour/update' : '/tour/create', payload);

          if (res.data.status) {
            reset();
            enqueueSnackbar(currentTour ? 'Update success!' : 'Create success!');
            router.push(paths.dashboard.tour.root);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    const start = 0;
    const end = Math.min(chunkSize, file.size);
    uploadChunk(start, end);
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
            <RHFTextField type="number" name="price_adult" label="Price adult" />
            <RHFTextField type="number" name="price_child" label="Price children" />
            <FilePond
              server={{
                load: (src, load) => {
                  fetch(src)
                    .then((res) => res.blob())
                    .then(load);
                },
              }}
              files={
                currentTour?.image
                  ? [
                      {
                        source: currentTour?.image,
                        options: {
                          type: 'local',
                        },
                      },
                    ]
                  : []
              }
              allowMultiple={false}
              onupdatefiles={(fileItems) => {
                handleFileUpload(fileItems.map((fileItem) => fileItem.file));
              }}
              name="files"
              labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
            />
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFEditor simple name="description" />
            </Stack>
            {/* <RHFTextField name="description" label="Description" multiline rows={5} /> */}
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
