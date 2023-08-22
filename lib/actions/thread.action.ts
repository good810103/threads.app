// Server Action: 沒有加上這個直接在 client 使用會出錯
'use server'

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";

interface Params{
    text: string;
    author: string;
    communityId: string | null;
    path: string;
};

export async function createThread({ text, author, communityId, path }: Params){
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        // update User model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id },
        });

        revalidatePath(path);

    }catch(error: any) {
        throw new Error(`Error creating thread: ${error.message}`);
    };
};

export async function fetchPosts(pageNumber = 1, pageSize = 20){
    connectToDB();

    // skipAmount 計算了需要跳過多少個文檔，這樣您就可以根據所需的分頁查詢來設定適當的跳過量。
    // 例如，如果 pageNumber 是 1，pageSize 是 20，則 skipAmount 將為 0，表示您不需要跳過任何文檔，從第一個文檔開始顯示。
    // 如果 pageNumber 是 2，則 skipAmount 將為 20，表示您需要跳過前 20 個文檔，從第 21 個文檔開始顯示。
    // 這種方法可以幫助您實現分頁功能，讓您在查詢大量文檔時，只顯示某一頁的內容，同時跳過之前的文檔。
    const skipAmount = (pageNumber - 1) * pageSize;

    // fetch the posts that have no parents (top-level threads...)
    const postsQuery =  Thread.find({
        // 查找 parentId 值為 null 或 undefined 的帖子。
        // $in: [null, undefined]：這是使用 $in 運算符來指定一個陣列，陣列中的值可以是 null 或 undefined。這將匹配具有這些值的帖子。
        parentId: { $in: [null,undefined] }
    }).sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User }) // path 要填充的參考屬性, model 指定要填充的模型名稱。
    .populate({ path: 'children', populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image' // 指定需要選擇的字段。
    } });

    const totalPostsCount = await Thread.countDocuments({
        parentId: { $in: [null,undefined] }
    });

    // exec() 函數被用於執行 postsQuery，即查詢符合條件的帖子。
    // exec() 函數是 Mongoose 中常用的方法，用於執行查詢操作，並將查詢結果返回
    const posts = await postsQuery.exec();

    // totalPostsCount：這是滿足特定條件（在這種情況下是 parentId 為 null 或 undefined）的帖子總數。
    // posts.length：這是當前頁面上實際顯示的帖子數量。
    // console.log(totalPostsCount);
    // console.log(skipAmount);
    // console.log(posts.length);
    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
};

export async function fetchThreadById(threadId: string){
    connectToDB();

    try {
        // TODO: Populate Community

        const thread = await Thread.findById(threadId)
        .populate({
            path: 'author',
            model: User,
            select: '_id id name image'
        })
        .populate({
            path: 'children',
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: '_id id name parentId image',
                },
                {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image',
                    }
                }
            ],
        }).exec();

        return thread;

    }catch(error: any) {
        throw new Error(`Error fetching thread: ${error.message}`);
    };
};

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string){
    connectToDB();

    try {
        // Find the original thread by its ID
        const originalThread = await Thread.findById(threadId);
        if(!originalThread) throw new Error('Thread not found');

        // Create a new thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        });

        // Save the new thread
        const savedCommentThread = await commentThread.save();

        // Update the original thread to include the new comment
        originalThread.children.push(savedCommentThread._id);

        // Save the original thread
        await originalThread.save();

        revalidatePath(path);

    }catch(error: any) {
        console.log('Error while adding comment', error);
        throw new Error('Unable to add comment');
    };
};

export async function fetchUserPosts(userId: string){
    try {
        connectToDB();

        // Find all threads authored by user with the given userId

        // TODO: Populate community
        const threads = await User.findOne({ id: userId })
        .populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image id',
                },
            },
        });

        return threads;

    }catch(error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`);
    };
};