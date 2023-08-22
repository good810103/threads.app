'use client';

import React, { ChangeEvent, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { UserValidation } from '@/lib/validations/user';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { updateUser } from '@/lib/actions/user.actions';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AccountProfileProps{
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    },
    btnTitle: string;
};

const AccountProfile = ({ user, btnTitle }: AccountProfileProps) => {
    // console.log(user.id);
    const [files,setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing('media');

    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || '',
            name: user?.name || '',
            username: user?.username || '',
            bio: user?.bio || '',
        },
    });

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if(e.target.files && e.target.files.length > 0){
            const file = e.target.files[0];
            
            setFiles(Array.from(e.target.files));

            // 檢查文件類型是不是圖片
            if(!file.type.includes('image')) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || '';

                fieldChange(imageDataUrl);
            };

            // 讀取完成後觸發 fileReader.onload
            fileReader.readAsDataURL(file);
        };
    };

    // 圖片上傳的 uploadthing 這邊有點困難
    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        const blob = values.profile_photo;

        const hasImageChanged = isBase64Image(blob);

        if(hasImageChanged){
            const imgResponse = await startUpload(files);
            // console.log(imgResponse);

            if(imgResponse && imgResponse[0].url) values.profile_photo = imgResponse[0].url;
        };

        await updateUser({
            userId: user.id,
            username: values.username,
            name: values.name,
            bio: values.bio,
            image: values.profile_photo,
            path: pathname,
        });

        if(pathname === '/profile/edit'){
            router.back();
        }else {
            router.push('/');
        };
    };

    return (
        <Form 
            {...form}
        >
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col justify-start gap-10"
            >
                {/* image input */}
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem
                            className='flex items-center gap-4'
                        >
                            <FormLabel className='account-form_image-label'>
                                {field.value ? (
                                    <Image 
                                        src={field.value} 
                                        alt='profile photo' 
                                        width={96} 
                                        height={96} 
                                        priority 
                                        className='rounded-full object-contain'
                                    />
                                ): (
                                    <Image 
                                        src='/assets/profile.svg'
                                        alt='profile photo' 
                                        width={24} 
                                        height={24} 
                                        className='object-contain'
                                    />
                                )}
                            </FormLabel>

                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input 
                                    type='file'
                                    accept='image/*'
                                    placeholder='Upload a photo'
                                    className='account-form_image-input'
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* name input */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem
                            className='flex flex-col w-full gap-3'
                        >
                            <FormLabel className='text-base-semibold text-light-2'>
                                Name
                            </FormLabel>

                            <FormControl>
                                <Input 
                                    type='text'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* username input */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem
                            className='flex flex-col w-full gap-3'
                        >
                            <FormLabel className='text-base-semibold text-light-2'>
                                Username
                            </FormLabel>

                            <FormControl>
                                <Input 
                                    type='text'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* bio input */}
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem
                            className='flex flex-col w-full gap-3'
                        >
                            <FormLabel className='text-base-semibold text-light-2'>
                                Bio
                            </FormLabel>

                            <FormControl>
                                <Textarea
                                    rows={10}
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='bg-primary-500'>
                    Submit
                </Button>
            </form>
        </Form>
    )
};

export default AccountProfile;