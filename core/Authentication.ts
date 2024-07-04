import {
  getIdToken as _getIdToken,
  isSignInWithEmailLink,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailLink,
  signInWithEmailAndPassword,
  signOut as _signOut,
  sendSignInLinkToEmail as _sendSignInLinkToEmail,
  updateProfile,
  initializeAuth,
} from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { readString, storeString, USER_EMAIL } from "./Storage";
import { useState, useEffect } from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import crashlytics from "@react-native-firebase/crashlytics";

const app = initializeApp({
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
});

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

/**
 * Wait until firebase is done initializing before we render the navigation stack
 * `onAuthStateChanged` fires eagerly on init, cannot be relied uppon for "ready state"
 * https://github.com/firebase/firebase-js-sdk/blob/5d5d6ec86fa5242962c4431f59aeaf89ec715d9b/packages/auth/src/core/auth/auth_impl.ts#L126
 */

export function isAuthenticationReady() {
  //@ts-ignore
  return auth._initializationPromise;
}

/**
 * Sync UserId to Logs & Analytics
 */
onAuthStateChanged(auth, (user) => {
  if (user && user.uid) crashlytics().setUserId(user?.uid);
});

export function isAuthenticated() {
  return !!getUser();
}

export function useIsAuthenticated() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    function handleChange() {
      setIsAuth(isAuthenticated());
    }

    return onAuthStateChanged(auth, handleChange);
  }, []);

  return [isAuth, setIsAuth];
}

export async function isAdmin() {
  const user = getUser();
  if (!user) return false;

  const tokenResult = await user.getIdTokenResult();
  return Boolean(tokenResult.claims.admin);
}

export function useIsActive() {
  const [_isActive, setIsActive] = useState(false);

  // Seed
  useEffect(() => {
    isActive().then(setIsActive);
  });

  // Sync
  useEffect(() => {
    function handleChange() {
      isActive().then(setIsActive);
    }

    return onIdTokenChanged(auth, handleChange);
  }, []);

  return [_isActive, setIsActive];
}

export async function isActive(forceRefresh?: boolean) {
  const user = getUser();
  if (!user) return false;

  const tokenResult = await user.getIdTokenResult(forceRefresh);
  return Boolean(tokenResult.claims.active);
}

let isAdminCache = false;
export function useIsAdmin() {
  const [_isAdmin, setIsAdmin] = useState(isAdminCache);

  useEffect(() => {
    isAdmin().then((result) => {
      isAdminCache = result;
      if (isAdminCache !== _isAdmin) setIsAdmin(isAdminCache);
    });
  });

  return [_isAdmin, setIsAdmin];
}

export function getUser() {
  return auth.currentUser;
}

export function getIdToken(forceRefresh?: boolean) {
  const user = getUser();
  if (user === null) return null;
  return _getIdToken(user, forceRefresh);
}

export async function sendSignInLinkToEmail(email: string) {
  email = email.trim();
  await storeString(USER_EMAIL, email);

  return _sendSignInLinkToEmail(auth, email, {
    dynamicLinkDomain: "applink.example.com",
    handleCodeInApp: true,
    iOS: {
      bundleId: Constants.manifest?.ios?.bundleIdentifier ?? "",
    },
    url: "https://applink.example.com",
  });
}

export async function signInDemoAccount(email: string) {
  if (email.toLowerCase() !== "appdemo@goaro.com") return;
  return signInWithEmailAndPassword(auth, email, "SKEQI0jhDWeU21WDdafne");
}

export async function loginWithLink(link: string) {
  if (!isSignInWithEmailLink(auth, link)) return;
  const email = await readString(USER_EMAIL);
  if (email === null) return;
  return signInWithEmailLink(auth, email, link);
}

export function signOut() {
  return _signOut(auth);
}

export function updateUserAccount(displayName: string) {
  const user = getUser();
  if (user === null) return;

  updateProfile(user, { displayName });
}
