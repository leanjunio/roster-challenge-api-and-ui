import "./Layout.css"

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <main>
      {children}
    </main>
  )
}