import Loading from '@/components/Loading'
import React, { Suspense } from 'react'
import QuestionPage from './QuestionPage'

const page = () => {
  return (
    <div>
        
<Suspense fallback={<Loading />}>
<QuestionPage />


</Suspense>



    </div>
  )
}

export default page