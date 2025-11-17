import { useState } from "react";
import { Card, CardContent } from "./card";
import Image from "next/image";
import { Button } from "../button";
import { Calendar, MapPin, User, X } from "lucide-react";

// Profile Card with Social Actions
export function ProfileCard({
    user,
    stats,
    isFollowing = false,
    className = ""
}: {
    user: {
        name: string;
        username: string;
        avatar: string;
        bio: string;
        location?: string;
        joinDate?: string;
    };
    stats: {
        followers: string;
        following: string;
        posts: string;
    };
    isFollowing?: boolean;
    className?: string;
}) {
    const [following, setFollowing] = useState(isFollowing);

    return (
        <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
            {/* Cover gradient */}
            <div className="h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <CardContent className="p-6 -mt-12 relative">
                {/* Avatar */}
                <div className="flex items-end justify-between mb-4">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-background shadow-lg">
                            <Image
                                src={user.avatar}
                                alt={user.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-background rounded-full" />
                    </div>

                    <Button
                        variant={following ? "outline" : "default"}
                        size="sm"
                        onClick={() => setFollowing(!following)}
                        className="mt-12"
                    >
                        {following ? (
                            <>
                                <X className="w-4 h-4 mr-2" />
                                Unfollow
                            </>
                        ) : (
                            <>
                                <User className="w-4 h-4 mr-2" />
                                Follow
                            </>
                        )}
                    </Button>
                </div>

                {/* User info */}
                <div className="space-y-3">
                    <div>
                        <h3 className="text-xl font-bold">{user.name}</h3>
                        <p className="text-muted-foreground">@{user.username}</p>
                    </div>

                    <p className="text-sm leading-relaxed">{user.bio}</p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {user.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {user.location}
                            </div>
                        )}
                        {user.joinDate && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Joined {user.joinDate}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 pt-4 border-t">
                        <div className="text-center">
                            <div className="font-bold">{stats.posts}</div>
                            <div className="text-xs text-muted-foreground">Posts</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold">{stats.followers}</div>
                            <div className="text-xs text-muted-foreground">Followers</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold">{stats.following}</div>
                            <div className="text-xs text-muted-foreground">Following</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}