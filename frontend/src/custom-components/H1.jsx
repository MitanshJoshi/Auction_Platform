import React from 'react'

const H1 = ({content,color}) => {
  return (
    <div className={`text-[${color}] text-2xl font-bold mb-2 min-[400px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}>
        { content }
    </div>
  )
}

export default H1
