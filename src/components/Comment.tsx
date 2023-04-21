import { Comment } from '@/API'
import formatDatePosted from '@/lib/formatDatePosted'
import { Grid, Paper, Typography } from '@mui/material'
import React from 'react'

type Props = { 
  comment: Comment
}

const PostComment = ({comment}: Props) => {
  console.log("comment: ", comment);
  return (
    <Paper style={{width: '100%', minHeight: 128, padding: 16, marginTop: 32}} elevation={1}>
      <Grid container spacing={1} direction='column'>
        <Grid item>
          <Typography variant='body1'><b>{comment.owner}</b> - <b>{formatDatePosted(comment.createdAt)}</b> hours ago</Typography>
          
        </Grid>
        <Grid item>
          <Typography variant='body2'>{comment.content}</Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default PostComment