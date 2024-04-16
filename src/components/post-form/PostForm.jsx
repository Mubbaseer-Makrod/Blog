import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import authService from '../../appwrite/auth'
import service from '../../appwrite/config'
import { Input, RTE, Select, Button } from '../index'

function PostForm({post}) {
    const {register, handleSubmit, watch, control, setValue, getValues}= useForm({
        defaultValues: {
            title: post?.title || "",
            content: post?.content || "",
            slug: post?.$id || "",
            status: post?.status || "active",
        }
    })
    console.log(post)
    console.log(getValues())
    const navigate = useNavigate()
    const userData = useSelector((state) => {
        return state.auth.userData
    })

    const submit = async(data) => {
        console.log(data)
        if(post) {
            const file = data.image[0] ? await service.uploadfile(data.image[0]) : null;

            if(file) {
                await service.deletefile(post.featuredImage)
            }

            const dbPost = await service.updatePost(post.$id, {
                ...data,
                featureImage: file ? file.$id : undefined
            })

            if(dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        } else {
            const file = data?.image[0] ? await service.uploadfile(data.image[0]) : null;

            if(file) {
                const createdPost = await service.createPost({
                    ...data, 
                    featureImage: file ? file.$id : undefined,
                    userId: userData.$id 
                })

                if(createdPost) {
                    navigate(`/post/${createdPost.$id}`)
                }
            }
        }
    }

    const slugTransform = useCallback((title) => {
        if(title && typeof title === "string") {
            return title
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-")
        }

        return ''

    }, [])

    useEffect(() => {
        const subscription = watch((value, {name}) => {
            console.log(" value is: ",value ," name is: ", name)
            if(name === 'title') {
                console.log("Here change in Title")
                setValue('slug', slugTransform(value.title, {shouldValidate: true}))
            }
        })

        return () => subscription.unsubscribe()
    }, [watch, slugTransform, setValue])

    console.log(getValues())

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}

export default PostForm