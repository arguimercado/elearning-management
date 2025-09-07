const StudentLayout = ({children} : {children: React.ReactNode}) => {
  
  return (
    <>
      <main className="container mx-auto px-4 md:px-6 lg:px-8">
         {children}
      </main>
    </>
  )
}
export default StudentLayout