import { useSession } from "@/store/session";
import { Navigate } from "react-router";

export default function MemberOnlyLayout() {
  const session = useSession();
  if (!session) return <Navigate to={"/sign-in"} replace={true} />;
}
