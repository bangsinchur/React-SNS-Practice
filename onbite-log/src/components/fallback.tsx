import { TriangleAlert } from "lucide-react";

export default function Fallback() {
  return (
    <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
      <TriangleAlert />
      <div>오류가 발생했습니다. 잠시후 다시 시도해 주세요.</div>
    </div>
  );
}
