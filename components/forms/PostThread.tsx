'use client';

import React from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ThreadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.action';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PostThreadProps{
    userId: string;
};

const PostThread = ({ userId }: PostThreadProps) => {
    // 這邊的 userId 是創建 User 時自動生成的 ObjectId, 並非 clerk 的那個 id
    // console.log(userId);

    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId,
        },
    });

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({ 
            text: values.thread,
            author: userId,
            communityId: null,
            path: pathname,
        });

        router.push('/');
    };

    return (
        <Form 
            {...form}
        >
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="mt-10 flex flex-col justify-start gap-10"
            >
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem
                            className='flex flex-col w-full gap-3'
                        >
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>

                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea 
                                    rows={15}
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' className='bg-primary-500'>
                    Post Thread
                </Button>
            </form>
        </Form>
    )
};

export default PostThread;