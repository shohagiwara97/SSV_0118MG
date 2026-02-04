import { Suspense } from "react";
import DetailClient from "./DetailClient";

const Loading = () => (
  <div className="space-y-4">
    <div className="h-10 w-40 rounded-2xl bg-surfaceAlt" />
    <div className="h-5 w-64 rounded-2xl bg-surfaceAlt" />
    <div className="h-64 rounded-3xl bg-surfaceAlt" />
  </div>
);

export default function DetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DetailClient />
    </Suspense>
  );
}
