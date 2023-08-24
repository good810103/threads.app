import React from 'react';
import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';

import { communityTabs } from '@/constants';
import { fetchCommunityDetails } from '@/lib/actions/community.action';

import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserCard from '@/components/cards/UserCard';

// 這邊的id 是 author.id
interface ProfileIdPageProps{
    communityId: string;
};

const ProfileIdPage = async ({ params }: { params: ProfileIdPageProps }) => {
    const user = await currentUser();
    if(!user) return null;

    const communityDetails = await fetchCommunityDetails(params.communityId);

    return (
        <section>
            <ProfileHeader 
                accountId={communityDetails.createdBy.id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type='Community'
            />

            <div className='mt-9'>
                <Tabs defaultValue='threads' className='w-full'>
                    <TabsList className='tab'>
                        {communityTabs.map(tab => (
                            <TabsTrigger key={tab.label} value={tab.value} className='tab transition-all duration-300'>
                                <Image 
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className='object-contain'
                                />

                                <p className='max-sm:hidden'>{tab.label}</p>

                                {tab.label === 'Threads' && (
                                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                        {communityDetails?.threads?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value='threads' className='w-full text-light-1'>
                        {/* @ts-ignore */}
                        <ThreadsTab 
                            currentUserId={user.id }
                            accountId={communityDetails._id}
                            accountType='Community'
                        />
                    </TabsContent>

                    <TabsContent value='members' className='w-full text-light-1'>
                        {/* @ts-ignore */}
                        <section className='mt-9 flex flex-col gap-10'>
                            {communityDetails?.members.map((member: any) => (
                                <UserCard 
                                    key={member.id}
                                    id={member.id}
                                    name={member.name}
                                    username={member.username}
                                    imgUrl={member.image}
                                    personType='User'
                                />
                            ))}
                        </section>
                    </TabsContent>

                    <TabsContent value='requests' className='w-full text-light-1'>
                        {/* @ts-ignore */}
                        <ThreadsTab 
                            currentUserId={user.id }
                            accountId={communityDetails._id}
                            accountType='Community'
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
};

export default ProfileIdPage;
