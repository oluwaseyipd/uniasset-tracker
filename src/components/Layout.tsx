import { Sidebar, Header } from "@/components/Sidebar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 overflow-y-auto sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
