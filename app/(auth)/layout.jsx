"use client"
import Loading from '@/components/Loading'
import Slider from '@/components/Slider'
import ThemeProvider from '@/components/ThemeProvider'
import { base_url } from '@/components/utils'
import { loginVerify } from '@/components/verifyLogin'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
axios.defaults.withCredentials = true


const layout = ({children}) => {
const [loading,setLoading]=useState(true)
useEffect(()=>{
    loginVerify(setLoading)
},[])

if(loading){
return <Loading  />
}


  return (
    <div>
<ThemeProvider>
<div className='h-screen flex '>
    <div>

<Slider />


    </div>

<div className='flex-1 h-full'>

{children}
</div>

</div>




</ThemeProvider>



    </div>
  )
}

export default layout