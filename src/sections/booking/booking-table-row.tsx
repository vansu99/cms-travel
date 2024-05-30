import { format } from 'date-fns';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: any;
  onDeleteRow: VoidFunction;
};

export default function TourTableRow({ row, selected, onEditRow, onDeleteRow }: Props) {
  const { person_quantity, tour_regis_id, status, tour, price, customer } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{tour_regis_id}</TableCell>
        <TableCell>{tour?.name}</TableCell>
        <TableCell>{tour?.location}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{price?.toLocaleString('vi-VN')}₫</TableCell>
        <TableCell>{person_quantity}</TableCell>
        <TableCell>{customer?.name}</TableCell>
        <TableCell>{customer?.phone_number}</TableCell>
        <TableCell>{customer?.email}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {format(new Date(tour?.start_time), 'dd/MM/yyyy')}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {format(new Date(tour?.end_time), 'dd/MM/yyyy')}
        </TableCell>
        <TableCell>
          <Typography sx={{ color: status === 'WAITING' ? '#FFBF00' : '#40A578' }}>
            {status}
          </Typography>
        </TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
