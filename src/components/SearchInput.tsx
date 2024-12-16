"use client";

import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import React, { useEffect } from "react";
import Input from "./Input";

export const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };

    const url = queryString.stringifyUrl({
      url: "/search",
      query,
    });

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <Input
      placeholder="What do you want to listen to?"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
