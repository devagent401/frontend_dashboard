import { Badge } from "../badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Sparkles } from "lucide-react";
import { Button } from "../button";
import { Award, CheckCircle, ArrowRight } from "lucide-react";

export function PremiumCard({
    title,
    description,
    price,
    features,
    isPopular = false,
    className = ""
}: {
    title: string;
    description: string;
    price: { amount: string; period: string };
    features: string[];
    isPopular?: boolean;
    className?: string;
}) {
    return (
        <div className={`relative group ${className}`}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 shadow-lg">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Most Popular
                    </Badge>
                </div>
            )}

            <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${isPopular ? 'border-orange-500 shadow-lg shadow-orange-500/25' : ''}`}>
                {isPopular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5" />
                )}

                <CardHeader className="text-center relative z-10">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isPopular ? 'bg-gradient-to-br from-orange-500 to-pink-500' : 'bg-gradient-to-br from-gray-600 to-gray-700'}`}>
                        <Award className="w-8 h-8 text-white" />
                    </div>

                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription className="text-base">{description}</CardDescription>

                    <div className="mt-4">
                        <div className="text-4xl font-bold">
                            ${price.amount}
                            <span className="text-lg font-normal text-muted-foreground">/{price.period}</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                    <ul className="space-y-3">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <Button
                        className={`w-full ${isPopular ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600' : ''}`}
                        size="lg"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}