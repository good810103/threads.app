import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchUser } from '@/lib/actions/user.actions';

import PostThread from '@/components/forms/PostThread';

const CreateThreadPage = async () => {
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    return (
        <>
            <h1 className='head-text'>Create Thread</h1>

            {/* 小心這邊傳入的 id 並非 currentUser 那邊來的 id, 而是在 mongoDB 的 User 自動創建的 _id */}
            <PostThread userId={userInfo._id} />
        </>
    )
};

export default CreateThreadPage;