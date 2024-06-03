import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';

import { fNumber } from 'src/utils/format-number';

interface Props extends CardProps {
  title: string;
  total: number;
  percent: number;
}

export default function AppWidgetSummary({ title, percent, total, sx, ...other }: Props) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>

        <Typography variant="h3">{fNumber(total) || 0}</Typography>
      </Box>
    </Card>
  );
}
