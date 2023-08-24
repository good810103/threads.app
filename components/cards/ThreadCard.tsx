import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { formatDateString } from '@/lib/utils';

interface ThreadCardProps{
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        name: string;
        image: string;
        id: string;
    };
    community: {
        id: string;
        name: string;
        image: string;
    } | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        };
    }[];
    isComment?: boolean;
};

const ThreadCard = ({ id, currentUserId, parentId, content, author, community, createdAt, comments, isComment }: ThreadCardProps) => {

    return (
        <article 
            className={`w-full flex flex-col rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}
        >
            <div className='flex items-center justify-between'>
                <div className='flex-1 w-full flex flex-row gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
                            <Image 
                                src={author.image} 
                                alt='Profile image' 
                                fill
                                className='cursor-pointer rounded-full object-cover'
                            />
                        </Link>

                        <div className='thread-card_bar' />
                    </div>

                    <div className='w-full flex flex-col'>
                        <Link href={`/profile/${author.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>{author.name}</h4>
                        </Link>

                        <p className='mt-2 text-samll-regular text-light-2'>{content}</p>

                        <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className='flex gap-3.5'>
                                <Image src='/assets/heart-gray.svg' alt='heart' width={24} height={24} 
                                className='cursor-pointer object-contain'/>

                                <Link href={`/thread/${id}`}>
                                    <Image src='/assets/reply.svg' alt='reply' width={24} height={24} 
                                    className='cursor-pointer object-contain'/>
                                </Link>

                                <Image src='/assets/repost.svg' alt='repost' width={24} height={24} 
                                className='cursor-pointer object-contain'/>

                                <Image src='/assets/share.svg' alt='share' width={24} height={24} 
                                className='cursor-pointer object-contain'/>
                            </div>

                            {isComment && comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className='mt-1 text-subtle-medium text-gray-1'>{comments.length} replies</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* TODO: DeleteThread */}
                {/* TODO: Show comment logos */}
            </div>

            {!isComment && community && (
                <Link 
                    href={`/communities/${community.id}`}
                    className='flex items-center mt-5'
                >
                    <p className='text-subtle-medium text-gray-1'>
                        {formatDateString(createdAt)} - {community.name} Community
                    </p>

                    <Image 
                        src={community.image}
                        alt={community.name}
                        width={40}
                        height={40}
                        className='ml-2 rounded-full object-cover'
                        style={{ width: '40px', height: '40px' }}
                    />
                </Link>
            )}
        </article>
    )
};

export default ThreadCard;