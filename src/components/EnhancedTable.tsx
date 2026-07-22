import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Tooltip } from '@mui/material';
import noProfileImg from '../assets/noPfp.png'
import CircularProgress from '@mui/material/CircularProgress';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EnhancedTableHead from './EnhancedTableHead.tsx';

import type {EnhancedTableProps, SingleRow} from "../types.ts";

export default function EnhancedTable<T extends SingleRow>({handleStartDelete, rows, total, currentPage, rowsPerPage, rowsPerPageOptions, onPageChange, onRowsPerPageChange, sort, onSortChange, isPending, headCells}: EnhancedTableProps<T>) {
  const tableOrder: "asc" | "desc" = sort.startsWith("-") || sort.endsWith("desc") ? "desc" : "asc";

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
    if (property === "tableNumber" || property === "numberOfSeats") {
      if (sort === property) {
        onSortChange(`-${property}`)
      } else {
        onSortChange(property)
      }
      return;
    }

    const [currentField, currentOrder] = sort.split(" ");

    const newOrder: "asc" | "desc" = currentField === property && currentOrder === "asc" ? "desc" : "asc";

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
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 3, overflow: 'hidden', border: 1, borderColor: 'divider'}} elevation={0}>
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
                height: 65,
                fontSize: '18px',
                py: 0,
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
              order={tableOrder}
              orderBy={sort.startsWith("-") ? sort.slice(1) : sort.split(' ')[0]}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '&:hover .MuiTableCell-root': {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  > 
                    {headCells.map((headCell) => (
                    <TableCell 
                      key={headCell.id}
                      component="th"
                      scope="row"
                    >  
                      {headCell.id === 'actions' ? (
                        <>
                          <Tooltip title='Edit' placement='top-start'>
                            <IconButton sx={{'&:hover': {color: 'primary.main', scale: 1.2, transition: 'all 0.3s ease-in-out'}}}>
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title='Delete' placement='top-start'>
                            <IconButton onClick={() => handleStartDelete(row.id)} sx={{ml: 2, '&:hover': {color: 'red', scale: 1.2, transition: 'all 0.3s ease-in-out'}}}>
                              <DeleteOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </>) : headCell.renderImage ? (
                          <Box sx={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                            <img src={headCell.renderImage(row) || undefined} 
                                  style={{width: 35, height: 35, borderRadius: '50%', objectFit: 'cover'}}
                                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                    e.currentTarget.src = noProfileImg;
                                    e.currentTarget.onerror = null
                                  }} 
                            />
                            <Tooltip title={headCell.render(row)} arrow placement="top-start">
                              <Box
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {headCell.render(row)}
                              </Box>
                            </Tooltip>
                          </Box>) : (
                            <Tooltip title={headCell.render(row)} arrow placement="top-start">
                              <Box
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {headCell.render(row)}
                              </Box>
                            </Tooltip>
                          )}
                    </TableCell>))}
                  </TableRow>
                ))}
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