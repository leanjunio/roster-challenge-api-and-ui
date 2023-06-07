type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <main className="container h-screen mx-auto py-20">
      {children}
    </main>
  )
}