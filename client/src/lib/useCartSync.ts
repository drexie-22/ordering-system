import { useEffect } from "react";

export function useCartSync(items: any[]) {
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);
}
