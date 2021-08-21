import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { StackRoutes } from "./stack.routes";
import { TabRoutes } from "./tab.routes";

import { useAuth } from "../hooks/auth";

export function Routes() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {user.id ? <TabRoutes /> : <StackRoutes />}
    </NavigationContainer>
  )
}
