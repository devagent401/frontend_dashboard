'use client';

import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Globe, DollarSign, Save, Upload, X } from 'lucide-react';

export default function CompanySettingsPage() {
    const [companyData, setCompanyData] = useState({
        name: 'Acme Corporation',
        email: 'info@acmecorp.com',
        phone: '+1 (555) 123-4567',
        website: 'www.acmecorp.com',
        address: {
            street: '123 Business Avenue',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
        },
        taxId: 'XX-XXXXXXX',
        registrationNumber: 'REG123456',
        currency: 'USD',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12',
    });

    const [logo, setLogo] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setCompanyData(prev => ({
                ...prev,
                address: { ...prev.address, [addressField]: value }
            }));
        } else {
            setCompanyData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setLogo('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // API call to save company settings
        console.log('Company settings:', companyData);
        alert('Company settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">Company Settings</h1>
                <p className="text-[var(--color-textSecondary)] mt-1">
                    Manage your company information and preferences
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Logo */}
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Company Logo</h2>
                    
                    {!logo ? (
                        <label className="block w-full cursor-pointer">
                            <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center hover:border-[var(--color-primary)] transition-colors">
                                <Upload className="w-12 h-12 mx-auto text-[var(--color-textSecondary)] mb-2" />
                                <p className="text-sm text-[var(--color-text)] mb-1">Click to upload company logo</p>
                                <p className="text-xs text-[var(--color-textSecondary)]">PNG or SVG recommended. Max size 2MB</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                        </label>
                    ) : (
                        <div className="relative inline-block">
                            <img
                                src={logo}
                                alt="Company logo"
                                className="h-24 object-contain rounded-lg border border-[var(--color-border)] p-4 bg-white"
                            />
                            <button
                                type="button"
                                onClick={removeLogo}
                                className="absolute -top-2 -right-2 p-2 bg-[var(--color-error)] text-white rounded-full hover:opacity-90 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Basic Information */}
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={companyData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={companyData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={companyData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                <Globe className="w-4 h-4 inline mr-2" />
                                Website
                            </label>
                            <input
                                type="text"
                                name="website"
                                value={companyData.website}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Tax ID
                            </label>
                            <input
                                type="text"
                                name="taxId"
                                value={companyData.taxId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Registration Number
                            </label>
                            <input
                                type="text"
                                name="registrationNumber"
                                value={companyData.registrationNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Company Location
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                name="address.street"
                                value={companyData.address.street}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                City *
                            </label>
                            <input
                                type="text"
                                name="address.city"
                                value={companyData.address.city}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                State/Province *
                            </label>
                            <input
                                type="text"
                                name="address.state"
                                value={companyData.address.state}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                ZIP/Postal Code *
                            </label>
                            <input
                                type="text"
                                name="address.zipCode"
                                value={companyData.address.zipCode}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Country *
                            </label>
                            <select
                                name="address.country"
                                value={companyData.address.country}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            >
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Australia">Australia</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="India">India</option>
                                <option value="China">China</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Regional Settings */}
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Regional Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Currency *
                            </label>
                            <select
                                name="currency"
                                value={companyData.currency}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            >
                                <option value="USD">USD - US Dollar ($)</option>
                                <option value="EUR">EUR - Euro (€)</option>
                                <option value="GBP">GBP - British Pound (£)</option>
                                <option value="JPY">JPY - Japanese Yen (¥)</option>
                                <option value="CAD">CAD - Canadian Dollar (C$)</option>
                                <option value="AUD">AUD - Australian Dollar (A$)</option>
                                <option value="INR">INR - Indian Rupee (₹)</option>
                                <option value="CNY">CNY - Chinese Yuan (¥)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Timezone *
                            </label>
                            <select
                                name="timezone"
                                value={companyData.timezone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            >
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="Europe/London">London (GMT)</option>
                                <option value="Europe/Paris">Paris (CET)</option>
                                <option value="Asia/Tokyo">Tokyo (JST)</option>
                                <option value="Asia/Shanghai">Shanghai (CST)</option>
                                <option value="Australia/Sydney">Sydney (AEDT)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Date Format *
                            </label>
                            <select
                                name="dateFormat"
                                value={companyData.dateFormat}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            >
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Time Format *
                            </label>
                            <select
                                name="timeFormat"
                                value={companyData.timeFormat}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
                            >
                                <option value="12">12-hour (AM/PM)</option>
                                <option value="24">24-hour</option>
                            </select>
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
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}

