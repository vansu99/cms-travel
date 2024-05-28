import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import PostNewEditForm from '../post-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  title: string;
};

export default function PostEditView({ title }: Props) {
  const settings = useSettingsContext();
  const [currentPost, setCurrentPost] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    async function getDetail() {
      try {
        const response = await axios.post('/advertise/detail', { id: title });
        setCurrentPost(response.data.data);
      } catch (error) {
        return error;
      }
    }

    getDetail();
  }, [title]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Blog',
            href: paths.dashboard.post.root,
          },
          {
            name: currentPost?.title,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentPost?.advertise_id ? (
        <PostNewEditForm currentPost={currentPost} />
      ) : (
        <div>Loading</div>
      )}
    </Container>
  );
}
