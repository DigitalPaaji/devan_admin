"use client"
import Slider from '@/components/Slider'
import ThemeProvider from '@/components/ThemeProvider'
import { base_url } from '@/components/utils'
import axios from 'axios'
import React, { useEffect } from 'react'
axios.defaults.withCredentials = true


const layout = ({children}) => {
const fetchSuperAdmin = async()=>{
    try {
        const response = await axios.get(`${base_url}/auth/verify-admin`)
        const data = await response.data;
        console.log(data)
    } catch (error) {
        
    }
}

useEffect(()=>{
    fetchSuperAdmin()
},[])




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