import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <SignIn 
        // 1. Where the user goes after successfully logging in
        forceRedirectUrl="/editor" 
        
        // 2. Where the user goes if they click "Sign Up" instead
        signUpUrl="/sign-up"
        
        // 3. Ensuring that even after switching to Sign-Up, they still land on /editor
        signUpForceRedirectUrl="/editor"

        appearance={{
          variables: { 
            colorPrimary: '#c026d3', // Matches your fuchsia button
            colorBackground: '#111', // Darker background to match your black theme
            colorText: 'white'
          },
        }}
      />
    </div>
  );
}