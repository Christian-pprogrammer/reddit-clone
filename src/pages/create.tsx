import { v4 as uuidv4 } from "uuid"
import MyDropzone from '@/components/ImageDropzone';
import { Button, Container, Grid, TextField } from '@mui/material'
import { API, Storage, Amplify } from 'aws-amplify';
import config from '../aws-exports'
Amplify.configure({
  ...config,
  Storage: {
    AWSS3: {
      bucket: 'amplify-reditclone-dev-72824-deployment', //REQUIRED -  Amazon S3 bucket name
      region: 'us-east-2', //OPTIONAL -  Amazon service region
    }
  }
})

import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { createPost } from "@/graphql/mutations";
import { CreatePostInput, CreatePostMutation, CreatePostMutationVariables } from "@/API";
import { useRouter } from "next/router";

interface IFormInput {
  title: string;
  content: string;
  image?: string

}

type Props = {}

const Create = (props: Props) => {
  const router = useRouter();
  const [file, setFile] = useState<File>()

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<IFormInput>()

  async function onSubmit(data: any): SubmitHandler<IFormInput> {
    if (file) {
      //user uploaded file
      try {
        const imagePath = uuidv4()
        await Storage.put(imagePath, file, {
          // contentType: 'image/png' //contentType is optional
        })

        const createNewPostInput: CreatePostInput = {
          title: data.title,
          contents: data.content,
          image: imagePath,
          upvotes: 0,
          downVotes: 0
        }
        const createNewPost = await API.graphql({
          query: createPost,
          variables: {
            input: createNewPostInput
          },
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
        }) as {data: CreatePostMutation};
        console.log("New post created successfully", createNewPost);
        router.push(`/post/${createNewPost.data.createPost?.id}`)
      } catch (error) {
        console.log("Error uploading the file: ", error);
      }
    }

  }
  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={2} direction='column'>
          <Grid item>
            <TextField
              fullWidth
              variant='outlined'
              id="title"
              label="Post title"
              type="text"
              error={errors.title ? true : false}
              helperText={errors.title ? `${errors.title.message}` : null}
              {...register("title", {
                required: { value: true, message: 'Please enter a title' },
                maxLength: { value: 120, message: 'Please enter a title that is 120 characters or less' }
              })}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              variant='outlined'
              id="content"
              label="Post content"
              type="text"
              multiline
              error={errors.content ? true : false}
              helperText={errors.content ? `${errors.content.message}` : null}
              {...register("content", {
                required: { value: true, message: 'Please enter some content' },
                maxLength: { value: 1000, message: 'Please make sure your content is 1000 characters or less' }
              })}
            />
          </Grid>
          <Grid item>
            <MyDropzone file={file} setFile={setFile} />
          </Grid>
          <Grid item>
            <Button variant='contained' type='submit'>
              Create Post
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default Create