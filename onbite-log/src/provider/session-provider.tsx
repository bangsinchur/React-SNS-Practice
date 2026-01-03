import GlobalLoader from "@/components/global-loader";
import supabase from "@/lib/supabase";
import { useIsSessionLoaded, useSetSession } from "@/store/session";
import { useEffect, type ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    //클린업 함수는 따로 만들어주지 않음.
    //이유:app컴포넌트를 나갔다는건 사용자가 페이지를 나갔다고 생각할수 있기 때문에,
  }, []);

  if (!isSessionLoaded) return <GlobalLoader />;

  return children;
}
