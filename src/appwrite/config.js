import { Client, Databases, Storage,  ID, Query } from "appwrite";
import conf from "../conf/conf";

export class Service {
    client = new Client();
    databases; 
    bucket;

    constructor() {
        this.client = this.client
                        .setEndpoint(conf.appwriteUrl)
                        .setProject(conf.appwriteProjectId)
        console.log(this.client)
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }
    
    async createPost({title, content, slug, featureImage, status, userId}) {
        try {
            // return await this.databases.createDocument(
            //     conf.appwriteDatabaseId,
            //     conf.appwriteCollectionId,
            //     slug,
            //     { title, content, featureImage, status, userId }
            // );
            console.log({title, content, slug, featureImage, status, userId})

            const post = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                { title, content, featureImage, status, userId }
            );
    
            if(!post) {
                return null
            }
    
            return post
        } catch (error) {
            console.log("appwrite service :: createPost :: error ", error)
        }
        
    }

    async updatePost(slug, {title, content, featureImage, status}) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId, 
                conf.appwriteCollectionId, 
                slug,
                {
                    title, content, featureImage, status
                }
            );
        } catch (error) {
            console.log("appwrite service :: updatePost :: error ", error)
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId, 
                conf.appwriteCollectionId, 
                slug,
            )
            return true
        } catch (error) {
            console.log("appwrite service :: deletePost :: error ", error)
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId, 
                conf.appwriteCollectionId, 
                slug,
            )
        } catch (error) {
            console.log("appwrite service :: getPost :: error ", error)
            return false
        }
    }

    async getPosts(queries=[Query.equal('status', 'active')]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId, 
                conf.appwriteCollectionId, 
                queries,
            );
        } catch (error) {
            console.log("appwrite service :: getPosts :: error ", error)
            return false
        }
    }

    // file upload service

    async uploadfile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("appwrite service :: uploadfile :: error ", error)
            return false
        }
    }

    async deletefile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true
        } catch (error) { 
            console.log("appwrite service :: deletefile :: error ", error)
            return false
        }
    }

    async getFilePreview(fileId) {
            return this.bucket.getFilePreview(
                conf.appwriteBucketId, 
                fileId
            );    
    }
}

const service = new Service()

export default service