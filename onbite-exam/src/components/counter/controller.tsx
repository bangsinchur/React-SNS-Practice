import { useDecrease, useIncrease } from "@/store/count";
import { Button } from "../ui/button";

export default function Controller() {
  const increase = useIncrease();
  const decrease = useDecrease();

  return (
    <div>
      <Button onClick={decrease}>-</Button>
      <Button onClick={increase}>+</Button>
    </div>
  );
}
