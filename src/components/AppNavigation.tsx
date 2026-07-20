// import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import type { Theme } from "@mui/material/styles";
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import { Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { NavLink } from 'react-router-dom';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import TableBarOutlinedIcon from '@mui/icons-material/TableBarOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TableBarIcon from '@mui/icons-material/TableBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import logoImg from '../assets/logo.png'

import { logOut } from '../util/auth';

interface DrawerProps {
    open: boolean;
}

const navItems = [
  { text: 'Employees', icon: <PeopleAltOutlinedIcon />, activeIcon: <PeopleAltIcon />, path: '/employees' },
  { text: 'Tables', icon: <TableBarOutlinedIcon />, activeIcon: <TableBarIcon />, path: '/tables' },
  { text: 'Foods', icon: <RestaurantOutlinedIcon />, activeIcon: <RestaurantIcon />, path: '/foods' },
  { text: 'New Order', icon: <AddShoppingCartOutlinedIcon />, activeIcon: <AddShoppingCartIcon />, path: '/new-order' },
  { text: 'Orders', icon: <ReceiptLongOutlinedIcon />, activeIcon: <ReceiptLongIcon />, path: '/orders' },
];

const drawerWidth = 240;

const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
//   width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(10)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<DrawerProps>(({ theme }) => {

  const miniDrawerWidth = `calc(${theme.spacing(10)} + 1px)`;
  
  return {
      zIndex: theme.zIndex.drawer + 1,
      marginLeft: miniDrawerWidth,
      width: `calc(100% - ${miniDrawerWidth})`,
    
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      variants: [
        {
          props: ({ open }) => open,
          style: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        },
      ],
    };
  })

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      borderRight: 'none',
    },
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function AppNavigation() {
//   const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [title, setTitle]= useState('Dashboard')
  const location = useLocation();
  const navigate = useNavigate()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 1,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          {open && <IconButton onClick={handleDrawerClose} color='inherit' edge='start' sx={{marginRight: 1}}>
            <ChevronLeftIcon />
          </IconButton>}
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
          <Button color='secondary' onClick={() => {logOut(); navigate('/login')}}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} 
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: 'primary.main',
          },
        }}
      >
        <DrawerHeader>
            {open && ( 
            <Typography sx={{ fontWeight: 'bold', pl: 2, fontSize: '18px', color: 'white' }}>
                BSS RESTAURANT
            </Typography>
            )}
            {!open && <img src={logoImg} style={{width: 50, margin: 'auto'}} />}
        </DrawerHeader>
        <Divider />
        <List sx={{px: 1, pt: 3, color: 'rgba(255, 255, 255, 0.8)'}}>
          {navItems.map((navItem) => {
            const isActive = location.pathname === `/dashboard${navItem.path}`;
            return (
            <ListItem key={navItem.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={NavLink}
                to={`/dashboard${navItem.path}`}
                sx={[
                  {
                    minHeight: 48,
                    px: !open ? 2.5 : undefined,
                    borderRadius: 2,
                    '&&.active':{
                        bgcolor: alpha('#fff', 0.2),
                        color: 'white',
                    }
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
              
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: 'center',
                        color: 'inherit',
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: 'auto',
                          },
                    ]}
                  >
                  {isActive ? navItem.activeIcon : navItem.icon}
                </ListItemIcon>
                <ListItemText
                  primary={navItem.text}
                  sx={[
                    {
                      '& .MuiListItemText-primary': {
                      }
                    },
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          )})}
        </List>        
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh', bgcolor: 'rgb(250, 248, 248)' }}>
        <DrawerHeader />
        <Outlet context={setTitle} />
      </Box>
    </Box>
  );
}
