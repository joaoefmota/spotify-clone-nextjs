import React, { FunctionComponent, PropsWithChildren } from "react";

type BoxProps = PropsWithChildren<{}> & {
  className?: string;
};

export const Box: FunctionComponent<BoxProps> = ({ children, className }) => {
  return (
    <div className={"bg-neutral-900 rounded-lg h-fit w-full " + className}>
      {children}
    </div>
  );
};
