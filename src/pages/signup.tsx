import { useUser } from "@/context/AuthContext";
import { Alert, Button, Grid, Snackbar, TextField } from "@mui/material";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Signup = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [signupError, setSignupError] = useState('');
  const { register, formState: { errors }, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {
    try {
      if(showCode) {
        confirmSignup(data);
      }else{
        console.log('form submitted')
        await signUpWithEmailAndPassword(data);
      }
      
    } catch (err: any) {
      setOpen(true);
      setSignupError(err.message);
    }

  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if(reason === 'clickaway') {
      return;
    }
    setOpen(false)
  }


  async function signUpWithEmailAndPassword(data: any) {
    const {username, password, email} = data;
    try{
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        }
      })
      setShowCode(true)
      console.log(user)
      return user;
    }catch(error: any) {
      setOpen(true);
      setSignupError(error.message);
    }
  }

  async function confirmSignup(data: any){
    const { username, password, code } = data;
    try {
      await Auth.confirmSignUp(username, code);
      /* Once the user successfully confirms their account, update form state to show the sign in form*/
      const amplifyUser = await Auth.signIn(username, password);
      console.log('Success, signed in user', amplifyUser);
      if(amplifyUser) {
        router.push('/')
      }else{
        alert('Something went wrong')
      }
    } catch (err) { console.log({ err }); }
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
            id="email"
            label="email"
            type="text"
            error={errors.email ? true : false}
            helperText={errors.email ? `${errors.email.message}` : null}
            {...register("email", {
              required: { value: true, message: 'Please enter an email' },
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
        {
          showCode && (<Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              id="code"
              label="Verification Code"
              type="text"
              error={errors.code ? true : false}
              helperText={errors.code ? `${errors.code.message}` : null}
              {...register("code", {
                required: { value: true, message: 'Please enter a code' },
              })}
            />
          </Grid>)
        }
        
        <Grid item>
          <Button type="submit" variant="contained">
            {showCode ? "Confirm code":"Sign up"}
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000}>
        <Alert severity="error" onClose={handleClose}>
          {signupError}
        </Alert>
      </Snackbar>
      
    </form>
  );
};

export default Signup;