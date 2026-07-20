import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { IconButton, Tooltip } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import noProfileImg from '../assets/noPfp.png'
import CircularProgress from '@mui/material/CircularProgress';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

interface User {
  id: string;
  fullName: string;
  email: string;
  image: string | null;
  phoneNumber: string;
}

interface Employee {
  id: string;
  designation: string;
  joinDate: string;
  user: User;
}

interface EnhancedTableHeadProps {
  order: "asc" | "desc";
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: string
  ) => void;
}

interface HeadCell {
  id: string,
  label: string
}

interface EnhancedTableProps {
  rows: Employee[];
  total: number;
  currentPage: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  isPending: boolean;
  headCells: HeadCell[]
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// function descendingComparator(a, b, orderBy) {  
//   const valA = (a.user[orderBy] || a[orderBy] || "").toString().toLowerCase()    // e.g a[orderBy] cud mean row['phoneNumber']
//   const valB = (b.user[orderBy] || b[orderBy] || "").toString().toLowerCase();

//   if (valB < valA) {    
//     return -1;
//   }
//   if (valB > valA) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }


function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const { order, orderBy, onRequestSort, headCells } =
    props;
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sx={{width: headCell.id === 'actions' ? '10%' : '18%'}}
            // sortDirection={orderBy === headCell.id ? order : false}  // for screen readers
          >
            {headCell.id !== 'actions' && headCell.id !== 'fullName' && headCell.id !== 'phoneNumber' ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}

                {orderBy === headCell.id && (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                )}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable({rows, total, currentPage, rowsPerPage, rowsPerPageOptions, onPageChange, onRowsPerPageChange, sort, onSortChange, isPending, headCells}: EnhancedTableProps) {

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
    const [currentField, currentOrder] = sort.split(' ');

    let newOrder = 'asc';

    if (currentField === property && currentOrder === 'asc') {
      newOrder = 'desc';
    }

    onSortChange(`${property} ${newOrder}`);
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(Number(event.target.value))
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {isPending && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(255, 255, 255, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            pointerEvents: 'auto'
          }}
          ><CircularProgress />
        </Box>
      )}
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 3, overflow: 'hidden'}} elevation={4}>
        <TableContainer sx={{
            height: isPending ? '25vh' : '75vh',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'}}>
          <Table
            stickyHeader
            sx={{ 
              tableLayout: 'fixed', // to make widths stick
              minWidth: 750,
              '& .MuiTableCell-root': {
                height: 80,
                fontSize: '18px',
                px: 4
              },
              '& .MuiTableHead-root .MuiTableCell-root': {
                color: (theme) => theme.palette.primary.main,
                '& .MuiTableSortLabel-root': {
                  color: (theme) => theme.palette.primary.main,
                  '& .MuiTableSortLabel-icon': {
                    fontSize: '18px'
                  },
                },
              }
            }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              headCells={headCells}
              order={sort.split(' ')[1] || 'asc'}
              orderBy={sort.split(' ')[0] || ''}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow
                    hover
                    sx={{
                      '&:hover .MuiTableCell-root': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                    key={row.id}
                  >
                    <TableCell sx={{display: 'flex', alignItems: 'center', gap: '15px'}}
                      component="th"
                      scope="row"
                    >  
                      <img 
                        src={`https://bssrms.runasp.net/images/user/${row.user.image}`} 
                        style={{width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover'}}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {e.currentTarget.src = noProfileImg, e.currentTarget.onerror=null}} />
                      <Box sx={{}}>
                        <Tooltip title={row.user.fullName} arrow placement='top-start'>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.user.fullName}
                        </Box>
                        </Tooltip>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Tooltip title={row.user.email} arrow placement='top-start'>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {row.user.email}
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Tooltip title={row.designation} arrow placement='top-start'>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.designation}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={formatDate(row.joinDate)} arrow placement='top-start'>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {formatDate(row.joinDate)}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.user.phoneNumber} arrow placement='top-start'>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.user.phoneNumber}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title='Edit' placement='top-start'>
                        <IconButton sx={{'&:hover': {color: 'primary.main', scale: 1.2, transition: 'all 0.3s ease-in-out'}}}>
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete' placement='top-start'>
                        <IconButton sx={{marginLeft: 2, '&:hover': {color: 'red', scale: 1.2, transition: 'all 0.3s ease-in-out'}}}>
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {!isPending && <TablePagination
          component="div"
          count={total}
          page={currentPage - 1}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />}
      </Paper>
    </Box>
  );
}
