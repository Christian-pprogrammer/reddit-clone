import React, { Dispatch, ReactElement, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { Auth, Hub } from "aws-amplify";

interface UserContextType {
  user: any | null,
  setUser: Dispatch<SetStateAction<any | null>>
}

const userContext = createContext<UserContextType | null>(null);

interface Props {
  children: React.ReactElement
}

export default function AuthContext({children}: Props): ReactElement {
  const [user, setUser] = useState(null)
  
  useEffect(()=>{
    checkUser();
  }, [])

  useEffect(()=>{
    Hub.listen("auth", ()=>{
      //perform some action to update state whenever auth event is detected
      checkUser()
    })
  }, [])

  async function checkUser() {
    try{
      const amplifyUser = await Auth.currentAuthenticatedUser();
      if(amplifyUser) {
        setUser(amplifyUser);
      }
    }catch(error) {
      //no current signed in user
      setUser(null);
    }
  }
  return (
    <userContext.Provider value={{user,setUser}}>
      {children}
    </userContext.Provider>
  )
}

export const useUser = (): UserContextType|null => useContext(userContext)