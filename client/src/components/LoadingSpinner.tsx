import { Layout } from "./Layout/Layout";

export function LoadingSpinner() {
  return (
    <Layout>
      <div className='flex items-center justify-center h-full'>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </Layout>
  )
}