import { UserButton, auth } from "@clerk/nextjs";
import Navigation from "@/components/specific/Navigation";
import StoreSwitcher from "@/components/specific/StoreSwitcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "../ThemeToggle";

export default async function Header() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <Navigation className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
