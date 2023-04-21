import Head from 'next/head'
import { Container, Typography, useTheme } from '@mui/material'
import { useUser } from '@/context/AuthContext'
import { listPosts } from '@/graphql/queries';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { ListPostsQuery, Post } from '@/API';
import { PostPreview } from '@/components/PostPreview';

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Array<Post>>([]);
  
  //Make request to graphql api
  useEffect(()=>{
    const fetchPostsFromApi = async (): Promise<Post[]> => {
      const allPosts = (await API.graphql({
        query: listPosts
      })) as {
        data: ListPostsQuery,
        errors: any[]
      }
      if(allPosts.data) {
        console.log(allPosts.data.listPosts?.items)
        setPosts(allPosts.data.listPosts?.items as Post[]);

        return allPosts.data.listPosts?.items as Post[]
      }else{
        throw new Error('Could not get posts')
      }
    }
    
    fetchPostsFromApi();
  }, [])

  

  return (
    <Container maxWidth="md">
      {
        posts.map((post)=>(
          <PostPreview key={post.id} post={post} />
        ))
      }
    </Container>
  )
}


// Get all the posts on the server-side
//since all users can read posts in our schema logic
//we can use the API Key authorization method
