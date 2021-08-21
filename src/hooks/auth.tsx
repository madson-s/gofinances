import React, {
  createContext,
  ReactNode,
  useContext,
  useState
} from 'react';
import * as Google from 'expo-google-app-auth';
import * as Apple from 'expo-apple-authentication';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AuthContextProps {
  user: User;
  isLoading: boolean;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);


function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState({} as User);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const userStoraged = await AsyncStorage.getItem('@gofinances:user');
      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }
      setIsLoading(false);
    }

    loadStoragedData();
  }, [])

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem('@gofinances:user');
  }

  async function signInWithGoogle() {
    try {
      const result = await Google.logInAsync({
        iosClientId: '204179604012-un39kn0etp41flvhaqtlppc59mrc5vqm.apps.googleusercontent.com',
        androidClientId: '204179604012-vs4gsaggsod37rhtcte6u0tqt4sqmhu9.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      })

      if (result.type === 'success') {
        const userLogged = {
          id: String(result.user.id),
          email: result.user.email,
          name: result.user.name,
          photo: result.user.photoUrl,
        };
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged));
        setUser(userLogged);
      }

    } catch(error) {
      throw new Error(error);
    }
  }

  async function signInWithApple() {
    try {
      const result = await Apple.signInAsync({
        requestedScopes: [
          Apple.AppleAuthenticationScope.FULL_NAME,
          Apple.AppleAuthenticationScope.EMAIL,
        ],
      })

      if (result) {
        const name = result.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

        const userLogged = {
          id: String(result.user),
          email: result.email,
          name,
          photo,
        };
        await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged));
        setUser(userLogged);
      }

    } catch(error) {
      throw new Error(error);
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signInWithGoogle,
      signInWithApple,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export {AuthProvider, useAuth}
