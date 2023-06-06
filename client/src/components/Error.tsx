import { Layout } from "./Layout/Layout";

type ErrorProps = {
  error: Error;
}

export function Error({ error }: ErrorProps) {
  return (
    <Layout>
      <div className='flex items-center justify-center h-screen'>
        <article className="prose content-center">
          <h1>Error</h1>
          <p>{error.message}</p>
        </article>
      </div>
    </Layout>
  )
}