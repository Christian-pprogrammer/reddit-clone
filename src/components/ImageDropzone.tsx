import { Grid, Theme, Typography } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const useStyles = makeStyles((theme: Theme)=>createStyles({
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  },
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%'
  }
}))

interface Props {
  file: File | undefined,
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
}

export default function Previews({file, setFile}: Props) {
  const classes = useStyles()
  const {getRootProps, getInputProps} = useDropzone({
    maxFiles: 1,
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles: any) => {
      setFile(acceptedFiles[0]);
    }
  }); 

  return (
    <>
    {
      !file ? (
        <section className="container" style={{borderStyle: 'dashed', borderWidth: 2, minHeight: 128, borderColor: 'rgba(255,255,255,0.5)'}}>
        <div {...getRootProps({className: 'dropzone'})} style={{padding: 16}}>
          <input {...getInputProps()} />
          <Typography variant='body1'>Drag and drop the image you want for your post.</Typography>
        </div>
  
      </section>
      ):(
        <Grid container alignItems="center" justifyContent="center" direction="column" spacing={1}>
          <Grid item>
            <Typography variant="h6">your image: </Typography>
          </Grid>
          <Grid item>
            <img src={URL.createObjectURL(file)} style={{width: 'auto', maxHeight: 320}} />
          </Grid>
        </Grid>
      )
    }
    </>
  );
}