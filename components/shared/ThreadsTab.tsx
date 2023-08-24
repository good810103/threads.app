import React from 'react';
import { redirect } from 'next/navigation';

import { fetchUserPosts } from '@/lib/actions/thread.action';
import { fetchCommunityPosts } from '@/lib/actions/community.action';

import ThreadCard from '@/components/cards/ThreadCard';

interface ThreadsTabProps{
    currentUserId: string;
    accountId: string;
    accountType: string;
};

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadsTabProps) => {
    let result: any;

    if(accountType === 'Community'){
        result = await fetchCommunityPosts(accountId);

    }else{
        result = await fetchUserPosts(accountId);
    };

    if(!result) redirect('/'); 

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {result.threads.map((thread: any) => (
                <ThreadCard 
                    key={thread._id} 
                    id={thread._id} 
                    currentUserId={currentUserId} 
                    parentId={thread.parentId} 
                    content={thread.text}
                    author={
                        accountType === 'User' 
                        ? { name: result.name, image: result.image, id: result.id } 
                        : { name: thread.author.name, image: thread.author.image, id: thread.author.id }}
                    community={
                        accountType === 'Community'
                        ? { name: result.name, id: result.id, image: result.image }
                        : thread.community
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    ) 
};

export default ThreadsTab;