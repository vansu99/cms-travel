import { useState, useEffect } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import axios from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';

import AppWidgetSummary from '../app-widget-summary';

const statusList = [
  {
    label: 'Current year',
    value: 'current_year',
  },
  {
    label: 'Last month',
    value: 'last_month',
  },
  {
    label: 'Last week',
    value: 'last_week',
  },
];

export default function OverviewAppView() {
  const settings = useSettingsContext();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [filter, setFilter] = useState('current_year');

  useEffect(() => {
    async function getDetailPrice() {
      try {
        const response = await axios.post('/analysis-price', { filter_by: filter });
        if (response.data.status) {
          setTotalPrice(response.data.data?.total_revenue || 0);
        } else {
          setTotalPrice(0);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getDetailPrice();
  }, [filter]);

  useEffect(() => {
    async function getDetailQuantity() {
      try {
        const response = await axios.post('/analysis-quantity', { filter_by: filter });
        if (response.data.status) {
          setTotalQuantity(response.data.data?.total_quantity || 0);
        } else {
          setTotalQuantity(0);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getDetailQuantity();
  }, [filter]);

  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid md={12} xs={12}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            label=""
            onChange={handleChange}
            sx={{ width: '180px' }}
          >
            {statusList.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid xs={12} md={6}>
          <AppWidgetSummary
            title="Tổng số lượng tour đã bán"
            total={totalQuantity || 0}
            percent={0}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <AppWidgetSummary title="Tổng doanh thu" percent={0} total={totalPrice || 0} />
        </Grid>
      </Grid>
    </Container>
  );
}
