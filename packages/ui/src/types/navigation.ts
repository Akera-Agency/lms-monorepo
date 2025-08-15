import { type JSX } from "react";

export type NavigationLink = {
  title?: string;
  url?: string;
  icon?: JSX.Element;
  label?: string;
  items?: {
    title: string;
    url: string;
    params?: Record<string, string | number | boolean> | undefined;
    searchParams?: Record<string, string | number | boolean> | undefined;
  }[];
  params?: Record<string, string | number | boolean> | undefined;
  searchParams?: Record<string, string | number | boolean> | undefined;
};

export interface ErrorType {
  value: {
    message: string;
  };
  status: number;
}
