import React from "react";

const Input = ({
  placeholder,
  type,
  ...props
}: {
  placeholder: string;
  type: string;
}) => {
  return (
    <input
      placeholder={placeholder}
      type={type}
      {...props}
      className=" w-full p-2 pl-10 px-3 ring-offset-2 border border-muted-foreground rounded-md text-sm shadow-sm outline-none focus:ring-primary focus-visible:ring-2"
    />
  );
};

export default Input;
