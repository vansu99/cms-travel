import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import SvgColor from 'src/components/svg-color';

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

export function useNavData() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const data = useMemo(
    () => [
      // MANAGEMENT
      {
        subheader: t('management'),
        items: [
          // USER
          {
            title: t('user'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              // { title: t('profile'), path: paths.dashboard.user.root },
              { title: t('list'), path: paths.dashboard.user.list },
              isAdmin ? { title: t('create'), path: paths.dashboard.user.new } : null,
              // { title: t('edit'), path: paths.dashboard.user.demo.edit },
              { title: t('account'), path: paths.dashboard.user.account },
            ].filter(Boolean),
          },
          // BLOG
          {
            title: t('blog'),
            path: paths.dashboard.post.root,
            icon: ICONS.blog,
            children: [
              { title: t('list'), path: paths.dashboard.post.root },
              // { title: t('details'), path: paths.dashboard.post.demo.details },
              isAdmin ? { title: t('create'), path: paths.dashboard.post.new } : null,
              // { title: t('edit'), path: paths.dashboard.post.demo.edit },
            ].filter(Boolean),
          },
          // TOUR
          {
            title: t('tour'),
            path: paths.dashboard.tour.root,
            icon: ICONS.tour,
            children: [
              { title: t('list'), path: paths.dashboard.tour.root },
              // { title: t('details'), path: paths.dashboard.tour.demo.details },
              isAdmin ? { title: t('create'), path: paths.dashboard.tour.new } : null,
              // { title: t('edit'), path: paths.dashboard.tour.demo.edit },
            ].filter(Boolean),
          },
          // BOOKING
          {
            title: 'Booking',
            path: paths.dashboard.booking.root,
            icon: ICONS.tour,
            children: [
              { title: t('list'), path: paths.dashboard.booking.root },
              // { title: t('create'), path: paths.dashboard.booking.new },
            ],
          },
        ],
      },
    ],
    [t, isAdmin]
  );

  return data;
}
