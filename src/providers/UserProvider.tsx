"use client";

import { MyUserContextProvider } from "@/hooks/useUser";
import { FunctionComponent, PropsWithChildren } from "react";

const UserProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return <MyUserContextProvider>{children}</MyUserContextProvider>;
};

export default UserProvider;
