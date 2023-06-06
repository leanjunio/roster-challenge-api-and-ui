import "./Layout.css"

type LayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function Layout({ title, children }: LayoutProps) {
  return (
    <main className="container mx-auto">
      <article className="prose my-10">
        <h1>{title}</h1>
      </article>
      {children}
    </main>
  )
}