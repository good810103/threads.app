import React from 'react';

const RightSidebar = () => {
    return (
        <section className='custom-scrollbar rightsidebar'>
            <div className='flex-1 flex flex-col justify-start'>
                <h3 className='text-heading-4-medium text-light-1'>Suggested Communities</h3>
            </div>

            <div className='flex-1 flex flex-col justify-start'>
                <h3 className='text-heading-4-medium text-light-1'>Suggested Users</h3>
            </div>
        </section>
    )
};

export default RightSidebar;