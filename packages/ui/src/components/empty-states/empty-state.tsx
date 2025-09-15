import React from 'react';

export function EmptyState({
    title,
    description,
    icon
    }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    }) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-20 px-6">
            {React.cloneElement(icon as React.ReactElement<any>, { className: "w-12 h-12 text-neutral-400 mb-6", strokeWidth: 1.5 })}
            <h3 className="text-xl font-medium text-neutral-200 mb-2 tracking-tight">{title}</h3>
            <p className="text-neutral-400 text-center max-w-md leading-relaxed">{description}</p>
        </div>
    );
}


// No users yet
// Users will appear here once they signup or get invited.