// Server Action: 沒有加上這個直接在 client 使用會出錯
'use server';

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Thread from "../models/thread.model";

import { FilterQuery, SortOrder } from "mongoose"; // type

interface UpdateUserProps{
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
};

// upsert 是 "update" 和 "insert" 的組合，意思是當指定的條件未找到文檔時，將創建一個新文檔來進行更新。
// 這意味著您正在嘗試根據提供的 userId 尋找一個用戶文檔。如果找到了匹配的文檔，則會將提供的屬性進行更新（username、name、bio、image、onboarded）。
// 如果沒有找到匹配的文檔，則會創建一個新的用戶文檔，並使用提供的屬性值填充。

/*
revalidatePath 函式是來自 next/cache 模組，通常用於 Next.js 項目中。
revalidatePath 函式的作用是重新驗證（revalidate）指定的路徑，以便在下一次請求時更新相關頁面的快取。
*/
export async function updateUser({ userId, username, name, bio, image, path }: UpdateUserProps): Promise<void>{
    connectToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId },
            { username: username.toLowerCase(), name, bio, image, onboarded: true },
            { upsert: true },
        );
    
        if(path === '/profile/edit'){
            revalidatePath(path);
        };

    }catch(error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    };
};

export async function fetchUser(userId: string){
    try {
        connectToDB();
        
        return await User.findOne({ id: userId })
        // .populate({
        //     path: 'communities',
        //     model: Community,
        // });

    }catch(error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    };
};

interface FetchUsersProps{
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
};
export async function fetchUsers({ userId, searchString = '', pageNumber = 1, pageSize = 20, sortBy = 'desc' }: FetchUsersProps){
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        // 這個正則表達式將被用來搜索包含 searchString 的內容，並且不區分字母的大小寫。
        const regex = new RegExp(searchString, 'i');

        const query: FilterQuery<typeof User> = {
            // $ne 是一個操作符，代表「不等於」
            id: { $ne: userId },
        };

        if(searchString.trim() !== ''){
            // $or 是 MongoDB 查詢語法的一部分，用於指定多個查詢條件之一成立即可
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        };

        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };

    }catch(error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`);
    };
};

// userId: _id
export async function getActivity(userId: string){
    try {
        connectToDB();

        // find all threads created by the user
        const userThreads = await Thread.find({ author: userId });

        // Collect all the child threads ids (replies) from the 'children' field
        // 從 userThreads 陣列中提取出所有使用者執行緒（userThread）的子執行緒（children）的 ID，並將它們組成一個新的陣列 childThreadIds。
        const childThreadIds = userThreads.reduce((acc,childThread) => {
            return acc.concat(childThread.children);
        },[]);

        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId },
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id',
        });

        return replies;

    }catch(error: any) {
        throw new Error(`Failed to fetch activity: ${error.message}`);
    }
};