import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
}

export function TabBarIcon({ name, color }: TabBarIconProps) {
  return <Ionicons name={name} size={24} color={color} />;
}
