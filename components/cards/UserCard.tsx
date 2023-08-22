'use client';

import React from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface UserCardProps{
    id: string;
    name: string;
    username: string;
    imgUrl: string;
    personType: string;
};

const UserCard = ({ id, name, username, imgUrl, personType }: UserCardProps) => {
    const router = useRouter();

    return (
        <article className='user-card'>
            <div className='user-card_avatar'>
                <Image
                    src={imgUrl}
                    alt='Logo'
                    width={48}
                    height={48}
                    style={{ width: '48px', height: '48px' }} 
                    className='rounded-full object-cover'
                />

                <div className='flex-1 text-ellipsis'>
                    <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>


            <Button className='user-card_btn' onClick={() => router.push(`/profile/${id}`)}>
                View
            </Button>
        </article>
    )
};

export default UserCard;