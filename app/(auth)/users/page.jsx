"use client"
import CreateUser from '@/components/CreateUser'
import GetUser from '@/components/GetUser'
import React, { useState } from 'react'

const page = () => {
  const [showCreate,setShowCreate]=useState(false)
  return (
    <div className='bg-red-300'>

{!showCreate && <GetUser setShowCreate={setShowCreate}  />


}


{showCreate && 
<CreateUser setShowCreate={setShowCreate} />
} 
    </div>
  )
}

export default page