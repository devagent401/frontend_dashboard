"use client";

import { Button } from "@/components/button";
import {
    ArrowRight,
    Bookmark,
    Heart,
    Play,
    Share2
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Glassmorphism Card with Gradient Border
export function GlassMorphismCard({
    title,
    description,
    image,
    stats,
    className = ""
}: {
    title: string;
    description: string;
    image: string;
    stats?: { label: string; value: string }[];
    className?: string;
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Floating orbs */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl transition-transform duration-700 group-hover:scale-150" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-xl transition-transform duration-700 group-hover:scale-125" />

            <div className="relative z-10 p-6">
                {/* Header with image */}
                <div className="relative mb-6">
                    <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Floating play button */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all duration-200 cursor-pointer">
                            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                            {title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            {stats.map((stat: { label: string; value: string }, index: number) => (
                                <div key={index} className="text-center">
                                    <div className="text-lg font-bold text-white">{stat.value}</div>
                                    <div className="text-xs text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Heart className="w-4 h-4 text-white" />
                            </button>
                            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Bookmark className="w-4 h-4 text-white" />
                            </button>
                            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200">
                                <Share2 className="w-4 h-4 text-white" />
                            </button>
                        </div>
                        <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Neumorphism Card


// Premium Feature Card




