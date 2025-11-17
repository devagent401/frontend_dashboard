'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, MapPin, Calendar, Lock, Eye, EyeOff, Camera, Save } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    
    // Profile form state
    const [profileData, setProfileData] = useState({
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: '+1 234 567 8900',
        address: '123 Main Street, New York, NY 10001',
        bio: 'Passionate about technology and innovation.',
        avatar: '',
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [avatarPreview, setAvatarPreview] = useState<string>('');

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setProfileData(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // API call to update profile
        console.log('Profile updated:', profileData);
        alert('Profile updated successfully!');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }

        // API call to change password
        console.log('Password change requested');
        alert('Password changed successfully!');
        
        // Reset form
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">User Profile</h1>
                <p className="text-[var(--color-textSecondary)] mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--color-border)]">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                            activeTab === 'profile'
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[var(--color-textSecondary)] hover:text-[var(--color-text)]'
                        }`}
                    >
                        Profile Information
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                            activeTab === 'password'
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[var(--color-textSecondary)] hover:text-[var(--color-text)]'
                        }`}
                    >
                        Change Password
                    </button>
                </div>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Profile Picture</h2>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center overflow-hidden">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-[var(--color-primary)]" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 p-2 bg-[var(--color-primary)] text-white rounded-full cursor-pointer hover:opacity-90 transition-opacity">
                                    <Camera className="w-4 h-4" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--color-text)]">Upload new photo</p>
                                <p className="text-xs text-[var(--color-textSecondary)] mt-1">
                                    JPG, PNG or GIF. Max size 2MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleProfileChange}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Account Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-[var(--color-background)] rounded-lg">
                                <Calendar className="w-5 h-5 text-[var(--color-textSecondary)]" />
                                <div>
                                    <p className="text-xs text-[var(--color-textSecondary)]">Member Since</p>
                                    <p className="text-sm font-medium text-[var(--color-text)]">January 15, 2024</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-[var(--color-background)] rounded-lg">
                                <User className="w-5 h-5 text-[var(--color-textSecondary)]" />
                                <div>
                                    <p className="text-xs text-[var(--color-textSecondary)]">User Role</p>
                                    <p className="text-sm font-medium text-[var(--color-text)]">Administrator</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            Change Password
                        </h2>
                        
                        <div className="space-y-4 max-w-md">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    Current Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="w-full px-4 py-2 pr-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-textSecondary)] hover:text-[var(--color-text)]"
                                    >
                                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    New Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-2 pr-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-textSecondary)] hover:text-[var(--color-text)]"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-[var(--color-textSecondary)] mt-1">
                                    Must be at least 8 characters long
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                    Confirm New Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="w-full px-4 py-2 pr-10 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-textSecondary)] hover:text-[var(--color-text)]"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="mt-6 p-4 bg-[var(--color-info)]/10 border border-[var(--color-info)]/20 rounded-lg">
                            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Password Requirements:</p>
                            <ul className="text-xs text-[var(--color-textSecondary)] space-y-1 ml-4">
                                <li>• At least 8 characters long</li>
                                <li>• Include uppercase and lowercase letters</li>
                                <li>• Include at least one number</li>
                                <li>• Include at least one special character</li>
                            </ul>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2"
                        >
                            <Lock className="w-4 h-4" />
                            Update Password
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

