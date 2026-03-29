import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <SignUp 
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/editor"
        appearance={{
          variables: { colorPrimary: '#c026d3' },
        }}
      />
    </div>
  );
}