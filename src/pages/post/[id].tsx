import { GetPostQuery, ListPostsQuery, Post } from '@/API'
import PostComment from '@/components/Comment'
import { PostPreview } from '@/components/PostPreview'
import { getPost, listPosts } from '@/graphql/queries'
import { Container } from '@mui/material'
import { API, withSSRContext } from 'aws-amplify'
import React from 'react'

type Props = {
  post: Post
}

export default function IndividualPost({post}: Props) {
  console.log("Get post: ", post)
  return ( 
    <Container maxWidth='md'>
      <PostPreview post={post} />
      {/*Start rendering some of the comments */}
      {
        post.comments?.items.map((comment)=>(
          <>
          {
            comment && <PostComment comment={comment} key={comment.id} />
          }
          </>
        ))
      }
    </Container>
  )
}

export async function getStaticPaths({req}: any) {
  const SSR = withSSRContext({req});
  const response = (await SSR.API.graphql({
    query: listPosts
  })) as {
    data: ListPostsQuery,
    errors: any[]
  }
  const paths = response.data.listPosts?.items.map((post)=>({
    params: {id: post?.id}
  }))
  return {
    paths: paths,
    fallback: true
  }
}

export async function getStaticProps({params}: any) {
  const SSR = withSSRContext();
  const postsQuery = (await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params.id
    }
  })) as {data: GetPostQuery}
  return {
    props: {
      post: postsQuery.data.getPost as Post
    }
  }
}
