import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ tenants, auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tenants
                    <Link
                        className="ml-4 float-right inline-flex items-center px-4 py-2 bg-blue-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        href={route('tenants.create')}
                    >
                        Add Tenant
                    </Link>
                </h2>
            }
        >
            <Head title="Tenants" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Domain
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tenants.map((tenant) => (
                                            <tr key={tenant.id} className="bg-white border-b">
                                                <th
                                                    scope="row"
                                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                                >
                                                    {tenant.name}
                                                </th>
                                                <td className="px-6 py-4">{tenant.email}</td>
                                                <td className="px-6 py-4">
                                                    {tenant.domains.map((domain, index) => (
                                                        <span key={domain.id}>
                                                            {domain.domain}
                                                            {index < tenant.domains.length - 1 ? ', ' : ''}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {/* Action buttons can go here */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
