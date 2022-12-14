 import {
   useEffect,
   useState,
   useContext,
   createContext,
   FunctionComponent,
 } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/compat/app";
import { removeTokenCookie, setTokenCookie } from "./tokenCookies"
import initFirebase from "./initFirebase";

initFirebase()

interface IAuthContext {
    user: firebase.User | null;
    logout: () => void;
    authenticated: boolean
}

const AuthContext = createContext<IAuthContext>({
    user: null,
    logout: () => null,
    authenticated: false,
});

export const AuthProvider = ({children}:{children: any}) => {

    const [user,setUser] = useState<firebase.User | null>(null)
    const router = useRouter();
    const logout = () => {
        firebase
        .auth()
        .signOut()
        .then(() => {
            router.push("/")
        })
        .catch((e)=> {
            console.log(e)
        })
        }

        useEffect(()=> {
            const cancelAuthListener = firebase.auth().onIdTokenChanged(async (user) => {
                if(user){
                    const token = await user.getIdToken();
                    setTokenCookie(token)
                    setUser(user)
                }else{
                    removeTokenCookie()
                    setUser(null)
                }            
            })
            return () => {
                cancelAuthListener();
            }
        } , []);

    return (
    <AuthContext.Provider value={{user, logout, authenticated : !!user}}>
        {children}
    </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}