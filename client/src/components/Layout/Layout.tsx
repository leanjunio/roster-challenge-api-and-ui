type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <main className="container mx-auto my-10">
      {children}
    </main>
  )
}