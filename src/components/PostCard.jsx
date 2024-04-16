import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import service from '../appwrite/config'

function PostCard({$id, title, featureImage}) {
    const [imagePreview, setImagePreview] = useState(null)
    const [error, setError] = useState("")

    console.log({$id, title, featureImage})

    useEffect(() => {
      const fetchImagePreview = async () => {
        try {
          const preview = await service.getFilePreview(featureImage);
          setImagePreview(preview);
          console.log(preview)
        } catch (error) {
          console.log(error.message)
          setError(error.message);
        }
      };
  
      fetchImagePreview();
    }, [featureImage]);

  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
                <img src={imagePreview} alt={title}
                className='rounded-xl' />

            </div>
            <h2
            className='text-xl font-bold'
            >{title}</h2>
        </div>
    </Link>
  )
}


export default PostCard