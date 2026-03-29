import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LeftSidebar from "./_components/LeftSidebar";
import RightSidebar from "./_components/RightSidebar";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    // overflow-hidden stops the page from growing beyond the viewport
    // when React Flow's 100vh child is rendered inside
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d0d0f]">
      {/* Left sidebar — fixed width, full height */}
      <LeftSidebar userName={user?.firstName ?? "User"} />

      {/* Canvas — takes all remaining width, React Flow handles its own height */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Right sidebar — fixed width, full height */}
      <RightSidebar />
    </div>
  );
}