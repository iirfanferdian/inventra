"use client";
import { Activity } from "react";
import General from "./General";
import Notifications from "./Notifications";
import Security from "./Security";
import { useSearchParams } from "next/navigation";

const Section = () => {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  return (
    <>
      <Activity mode={!section ? "visible" : "hidden"}>
        <General />
      </Activity>
      <Activity mode={section === "notifications" ? "visible" : "hidden"}>
        <Notifications />
      </Activity>
      <Activity mode={section === "security" ? "visible" : "hidden"}>
        <Security />
      </Activity>
    </>
  );
};

export default Section;
