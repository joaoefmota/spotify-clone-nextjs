import getSongByTitle from "@/actions/getSongByTitle";
import { Header } from "@/components/Header";
import { SearchInput } from "@/components/SearchInput";
import React, { FunctionComponent } from "react";
import { SearchContent } from "./components/SearchContent";

interface SearchProps {
  searchParams: {
    title: string;
  };
}

const Search: FunctionComponent<SearchProps> = async ({ searchParams }) => {
  const songs = await getSongByTitle(searchParams.title);
  return (
    <div className="bg-neural-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} />
    </div>
  );
};

export default Search;
