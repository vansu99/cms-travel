import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import ImageUploading, { ImageListType } from 'react-images-uploading';

import { useResponsive } from 'src/hooks/use-responsive';

import axios from 'src/utils/axios';

import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useSnackbar } from 'src/components/snackbar';

import { imgUrlToFileObj, imageUrlToBase64 } from 'src/utils/upload-img';

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
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);

      if (currentPost.image) {
        const getInitImg = async () => {
          const response1 = await imgUrlToFileObj(currentPost.image);
          const response2 = await imageUrlToBase64(currentPost.image);
          setImages([{ dataURL: response2, file: response1 }]);
        };
        getInitImg();
      }
    }
  }, [currentPost, defaultValues, reset]);

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

          if (currentPost) {
            payload = {
              ...data,
              image: fetchResponse.secure_url || '',
              advertise_id: currentPost?.advertise_id,
            };
          } else {
            payload = {
              ...data,
              image: fetchResponse.secure_url,
            };
          }

          const res = await axios.post(
            currentPost ? '/advertise/update' : '/advertise/create',
            payload
          );

          if (res.data.status) {
            reset();
            enqueueSnackbar(currentPost ? 'Update success!' : 'Create success!');
            router.push(paths.dashboard.post.root);
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
            <RHFTextField name="name" label="Post Title" />
            <RHFTextField name="location" label="Location" />
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
