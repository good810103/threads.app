'use client';

import React from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

import { CommentValidation } from '@/lib/validations/thread';
import { addCommentToThread } from '@/lib/actions/thread.action';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CommentProps{
    threadId: string;
    currentUserImage: string;
    currentUserId: string;
};

const Comment = ({ threadId, currentUserImage, currentUserId }: CommentProps) => {
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);

        form.reset();
    };

    return (
        <Form 
            {...form}
        >
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="comment-form"
            >
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem
                            className='flex items-center w-full gap-3'
                        >
                            <FormLabel className='text-base-semibold text-light-2'>
                                <Image 
                                    src={currentUserImage}
                                    alt='Profile image'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'
                                    style={{ width: '48px', height: '48px' }}
                                />
                            </FormLabel>

                            <FormControl className='border-none bg-transparent'>
                                <Input 
                                    type='text'
                                    placeholder='Comment...'
                                    className='no-focus text-light-1 outline-none'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='comment-form_btn'>
                    Reply
                </Button>
            </form>
        </Form>
    )
};

export default Comment;