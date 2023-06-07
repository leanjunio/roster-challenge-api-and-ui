type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <main className="px-4 container h-fit mx-auto py-20">
      {children}
    </main>
  )
}