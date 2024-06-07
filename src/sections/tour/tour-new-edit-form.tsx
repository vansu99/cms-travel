import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import ImageUploading, { ImageListType } from 'react-images-uploading';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import axios from 'src/utils/axios';
import { imgUrlToFileObj, imageUrlToBase64 } from 'src/utils/upload-img';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFEditor, RHFTextField } from 'src/components/hook-form';

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

      if (currentTour.image) {
        const getInitImg = async () => {
          const response1 = await imgUrlToFileObj(currentTour.image);
          const response2 = await imageUrlToBase64(currentTour.image);
          setImages([{ dataURL: response2, file: response1 }]);
        };
        getInitImg();
      }
    }
  }, [currentTour, defaultValues, reset]);

  const [images, setImages] = useState<any>([]);
  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    setImages(imageList as never[]);
  };
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const onSubmit = handleSubmit(async (data) => {
    const preset_key = 'hz1vxe85';
    const clound_name = 'droaa5vpq';

    const uniqueUploadId = `uqid-${Date.now()}`;
    const chunkSize = 5 * 1024 * 1024;
    const file = images[0].file;
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

        currentChunk += 1;

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
            <ImageUploading
              value={images}
              onChange={onChange}
              maxNumber={1}
              acceptType={['jpg', 'png']}
            >
              {({ imageList, onImageUpdate, onImageRemove }) => (
                <div className="upload__image-wrapper">
                  <Button
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    onClick={() => onImageUpdate(0)}
                  >
                    Upload file
                    <VisuallyHiddenInput type="file" />
                  </Button>
                  {imageList.map((image, index) => (
                    <Button
                      key={index}
                      className="image-item"
                      style={{ marginTop: 20 }}
                      onClick={() => onImageRemove(0)}
                    >
                      <img src={image.dataURL} alt="" style={{ cursor: 'pointer' }} />
                    </Button>
                  ))}
                </div>
              )}
            </ImageUploading>
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
