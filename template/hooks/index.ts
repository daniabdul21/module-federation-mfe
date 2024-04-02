import { useState } from "react";

export const useSomeHook = (payload: string) => {
  const [value, setValue] = useState<string>(payload);

  return {
    value,
    setValue,
  };
};
