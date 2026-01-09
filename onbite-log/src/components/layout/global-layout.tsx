import { Link, Outlet } from "react-router";
import logo from "@/assets/logo.png";
import ProfileButton from "./header/profile-button";
import ThemeButton from "./header/theme-button";

export default function GlobalLayout() {
  return (
    <div className="flex min-h-[100vh] flex-col">
      <header className="h-15 border-b">
        <div className="m-auto flex h-full w-full max-w-175 justify-between px-4">
          <Link to={"/"} className="flex items-center gap-2">
            <img
              className="h-5"
              src={logo}
              alt="한입로그의 로고, 메세지 말풍선을 형상화한 모양이다"
            />
            <div className="font-bold">B.GENLOG</div>
          </Link>
          <div className="flex items-center gap-5">
            <ThemeButton />
            <ProfileButton />
          </div>
        </div>
      </header>
      <main className="m-auto w-full max-w-175 flex-1 border-x px-4 py-6">
        {/* 페이지 컴포넌트가 실제로 렌더링될 위치를 지정하는 컴포넌트 - Outlet */}
        <Outlet />
      </main>
      <footer className="text-muted-foreground border-t py-10 text-center">
        @BGN.Developer
      </footer>
    </div>
  );
}
