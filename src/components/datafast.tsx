import { useEffect } from "react";
import { initDataFast } from "datafast";

export function DataFast() {
  useEffect(() => {
    void initDataFast({ websiteId: "dfid_TviZnB7jqhu0vWvSHp9IH" });
  }, []);

  return null;
}
