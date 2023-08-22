import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { fetchUser, getActivity } from '@/lib/actions/user.actions';
import Image from 'next/image';

const ActivityPage = async () => {
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    // getActivity
    const activity = await getActivity(userInfo._id);

    return (
        <section>
            <h1 className='head-text mb-10'>Activity</h1>

            <section className='mt-10 flex flex-col gap-5'>
                {activity.length > 0 ? (
                    <>
                        {activity.map(item => (
                            <Link key={item._id} href={`/thread/${item.parentId}`}>
                                <article className='activity-card'>
                                    <Image 
                                        src={item.author.image}
                                        alt='Profile image'
                                        width={36}
                                        height={36}
                                        className='rounded-full object-cover'
                                        style={{ width: '36px', height: '36px' }}
                                    />

                                    <p className='!text-samll-regular text-light-1'>
                                        <span className='mr-1 text-primary-500'>
                                            {item.author.name}
                                        </span>{" "}
                                        replied to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className='!text-base-regular text-light-3'>No activity yet</p>
                )}
            </section>
        </section>
    )
};

export default ActivityPage;