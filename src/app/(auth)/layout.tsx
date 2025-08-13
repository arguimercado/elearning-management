const LoginLayout = ({ children } : { children: React.ReactNode }) => {
  return (
  <div className="w-full min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="max-w-md mx-auto py-10 px-4">
        {children}
      </div>
    </div>
  )
}
export default LoginLayout