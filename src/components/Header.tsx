import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useUser } from '@/context/AuthContext';
import { Box, Button, Theme, Tooltip, createStyles } from '@mui/material';
import { AddCircleOutline, Reddit } from '@mui/icons-material';
import { useRouter } from 'next/router';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Auth } from 'aws-amplify';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme)=>createStyles({
  root: {
    flexGrow: 1,
    marginBottom: 32 
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title:{
    flexGrow: 1
  }
}))

export default function Header() {
  const styles = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user } = useUser()
  const router = useRouter()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signUserOut = async () => {
    try{
      await Auth.signOut()
    }catch(err) {
      console.log(err)
    }
    
  }


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='inherit'>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Reddit /> 
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Redit clone
          </Typography>
          {
            user && (
              <div>
                <Tooltip title="Create Post">
                  <IconButton 
                    aria-label="create"
                    color='inherit'
                    onClick={()=>router.push('/create')}
                  >
                    <AddCircleOutline />
                  </IconButton>
                </Tooltip>
                <IconButton 
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={()=>signUserOut()}>Sign Out</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                </Menu>
              </div>
            )
          } 
          {
            !user && (
              <>
                <Button variant='outlined' onClick={()=>router.push('/login')}>Login</Button>
                <Button variant='contained' color='primary' onClick={()=>router.push('/signup')}>Sign Up</Button>
              </>
            )
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}