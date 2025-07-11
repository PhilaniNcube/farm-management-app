import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-82px)]">
      <SignUp signInFallbackRedirectUrl={"/dashboard"} />
    </div>
  );
}
