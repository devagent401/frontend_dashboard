"use client";
import { useState } from "react";

// Interactive Flip Card
export function FlipCard({
    frontContent,
    backContent,
    className = ""
}: {
    frontContent: React.ReactNode;
    backContent: React.ReactNode;
    className?: string;
}) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={`relative w-full h-96 cursor-pointer perspective-1000 ${className}`}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 shadow-2xl flex flex-col justify-between text-white">
                        {frontContent}
                    </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                    <div className="w-full h-full bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl p-6 shadow-2xl flex flex-col justify-between text-white">
                        {backContent}
                    </div>
                </div>
            </div>
        </div>
    );
}