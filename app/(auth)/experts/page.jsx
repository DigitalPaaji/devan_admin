"use client"
import CreateExpert from '@/components/CreateExpert'
import GetExpert from '@/components/GetExpert'
import React, { useState } from 'react'

const page = () => {
  const [showCreate,setShowCreate]=useState(false)

  return (
    <div>
       {!showCreate && <GetExpert setShowCreate={setShowCreate}  />


} 

        {showCreate && 
  <CreateExpert setShowCreate={setShowCreate} />       
        }


    </div>
  )
}


export default page

