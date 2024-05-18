import merge from 'lodash/merge';
// date fns
import { vi as viVNAdapter, enUS as enUSAdapter } from 'date-fns/locale';

// core (MUI)
import { enUS as enUSCore, viVN as viVNCore } from '@mui/material/locale';
// data grid (MUI)
import { enUS as enUSDataGrid, viVN as viVNDataGrid } from '@mui/x-data-grid';
// date pickers (MUI)
import { enUS as enUSDate, viVN as viVNDate } from '@mui/x-date-pickers/locales';

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
    numberFormat: {
      code: 'en-US',
      currency: 'USD',
    },
  },
  {
    label: 'Vietnamese',
    value: 'vi',
    systemValue: merge(viVNDate, viVNDataGrid, viVNCore),
    adapterLocale: viVNAdapter,
    icon: 'flagpack:vn',
    numberFormat: {
      code: 'vi-VN',
      currency: 'VND',
    },
  },
];

export const defaultLang = allLangs[0]; // English
