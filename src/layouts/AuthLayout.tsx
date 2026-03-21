import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="OkSplit"
            className="mx-auto mb-4 h-40 w-auto object-contain"
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
