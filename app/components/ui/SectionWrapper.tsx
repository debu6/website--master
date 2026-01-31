import React from 'react';

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className = "", id }) => {
    return (
        <section id={id} className={`w-full px-4 md:px-8 lg:px-16 py-12 md:py-20 ${className}`}>
            <div className="max-w-[1920px] mx-auto">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;
