import { useUser } from "@/context/AuthContext";
import { Alert, Button, Grid, Snackbar, TextField } from "@mui/material";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [signinError, setSigninError] = useState('');

  const { register, formState: { errors }, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {
    const {username, password} = data;
    try{
      const amplifyUser = await Auth.signIn(username, password);
      console.log('Success, signed in user', amplifyUser);
      if(amplifyUser) {
        router.push('/')
      }else{
        
        alert('Something went wrong')
      }
    }catch(err: any) {
      setSigninError(err.message);
    }

  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if(reason === 'clickaway') {
      return;
    }
    setOpen(false)
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1} maxWidth={400} mx={'auto'}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="username"
            label="username"
            type="text"
            error={errors.username ? true : false}
            helperText={errors.username ? `${errors.username.message}` : null}
            {...register("username", {
              required: { value: true, message: 'Please enter a username' },
              minLength: { value: 3, message: 'Please enter a username between 3-16 characters' },
              maxLength: { value: 16, message: 'Please enter a username between 3-16 characters' }
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="password"
            label="password"
            type="password"
            error={errors.password ? true : false}
            helperText={errors.password ? `${errors.password.message}` : null}
            {...register("password", {
              required: { value: true, message: 'Please enter a password' },
              minLength: {
                value: 8,
                message: 'Please enter strong password'
              }              
            })}
          />
        </Grid>
        
        <Grid item>
          <Button type="submit" variant="contained">
            Sign in
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000}>
        <Alert severity="error" onClose={handleClose}>
          {signinError}
        </Alert>
      </Snackbar>
      
    </form>
  );
};

export default Login;