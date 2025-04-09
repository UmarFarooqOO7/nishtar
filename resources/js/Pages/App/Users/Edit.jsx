import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedAppLayout from '@/Layouts/AuthenticatedAppLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

export default function Edit({ auth, user, roles }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        roles: user.roles.map(role => role.id) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('users.update', user.id));
    };

    const handleRoleToggle = (roleId) => {
        const currentRoles = [...data.roles];

        if (currentRoles.includes(roleId)) {
            setData('roles', currentRoles.filter(id => id !== roleId));
        } else {
            setData('roles', [...currentRoles, roleId]);
        }
    };

    return (
        <AuthenticatedAppLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit User
                </h2>
            }
        >
            <Head title="Edit User" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />

                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />

                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="email" value="Email" />

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />

                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel value="Roles" />
                                    <div className="mt-2 space-y-2">
                                        {roles.map(role => (
                                            <div key={role.id} className="flex items-center">
                                                <Checkbox
                                                    name="roles[]"
                                                    value={role.id}
                                                    checked={data.roles.includes(role.id)}
                                                    onChange={() => handleRoleToggle(role.id)}
                                                />
                                                <span className="ml-2 text-sm text-gray-600">{role.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.roles} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        Update
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedAppLayout>
    );
}
