import { currentUser } from "@clerk/nextjs";

import AccountProfile from "@/components/forms/AccountProfile";

const OnboardingPage = async() => {
    const user = await currentUser();

    const userInfo = {};

    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || '',
        bio: userInfo?.bio || '',
        image: userInfo?.image || user?.imageUrl,
    };

    return (
        <main className="flex max-w-3xl mx-auto flex-col justify-start px-10 py-20">
            <h1 className="head-text">OnBoarding</h1>

            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile now to use Threads
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile user={userData} btnTitle='Contiune' />
            </section>
        </main>
    )
};

export default OnboardingPage;