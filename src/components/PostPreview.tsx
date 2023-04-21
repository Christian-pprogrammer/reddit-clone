import { Post } from '@/API'
import formatDatePosted from '@/lib/formatDatePosted'
import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import { Box, ButtonBase, Grid, IconButton, Paper, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

interface Props {
  post: Post
}

export const PostPreview = ({post}: Props) => {

  const router = useRouter();
  return (
    <Paper elevation={3}>
    <Grid 
      container 
      direction="row" 
      justifyContent='flex-start'
      alignItems='flex-start'
      spacing={3}
      wrap='nowrap'
      style={{
        padding: 12,
        marginTop: 24
      }}
    >
      {/*Upvote /votes/downvote */}
      <Grid item direction="column" spacing={1} alignItems='center' style={{
        maxWidth: 128
      }}>
        <Grid container direction='column' alignItems='center'>
          <Grid item>
            <IconButton color='inherit'>
              <ArrowUpward />
            </IconButton>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" direction="column">
              <Grid item>
                <Typography variant='h6'>{(post.upvotes - post.downVotes).toString()}</Typography>
              </Grid>
              <Grid item>
                <Typography variant='body2'>votes</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <IconButton color='inherit'>
              <ArrowDownward />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <ButtonBase onClick={()=>router.push(`/post/${post.id}`)}>
          <Grid container direction='column' alignItems='flex-start'>
            <Grid item>
              <Typography variant='body1'>Posted by <b>{post.owner}</b>{" "}<b>{formatDatePosted(post.createdAt)}</b> hours ago</Typography>
            </Grid>
            <Grid item>
              <Typography variant='h2'>{post.title}</Typography>
            </Grid>
            <Grid item style={{maxHeight: 32, overflowY: 'hidden', overflowX: 'hidden'}}>
              <Typography variant='body1'>{post.contents}</Typography>
            </Grid>
            {
              !post.image && (
                <Grid item>
                  <Image src={`https://source.unsplash.com/random/980x540`} height={540} width={980} alt='vercel' layout='intrinsic' />
                </Grid>
              )
            }
          </Grid>
        </ButtonBase>
      </Grid>
    </Grid>
    </Paper>
  )
}