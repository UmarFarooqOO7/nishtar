import { useRef, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function UpdateProfilePictureForm({ className = '' }) {
    const { auth } = usePage().props;
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        photo: null,
    });

    const selectImage = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setData('photo', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.photo.update'), {
            preserveScroll: true,
            onSuccess: () => reset('photo'),
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Picture</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account profile picture.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="photo" value="Photo" />

                    <div className="mt-2 flex flex-col items-center">
                        {previewUrl ? (
                            <div className="mb-4">
                                <img
                                    src={previewUrl}
                                    alt="Profile preview"
                                    className="rounded-full h-32 w-32 object-cover border-4 border-gray-200"
                                />
                            </div>
                        ) : (
                            auth?.user?.profile_photo_url && (
                                <div className="mb-4">
                                    <div className="text-xs text-gray-500 mb-2">
                                    </div>
                                    <img
                                        src={auth.user.profile_photo_url}
                                        alt="Current profile"
                                        className="rounded-full h-32 w-32 object-cover border-4 border-gray-200"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&color=7F9CF5&background=EBF4FF`;
                                            console.log("Image failed to load:", auth.user.profile_photo_url);
                                        }}
                                    />
                                </div>
                            )
                        )}

                        <input
                            type="file"
                            id="photo"
                            ref={fileInputRef}
                            onChange={handlePhotoChange}
                            className="hidden"
                            accept="image/*"
                        />

                        <PrimaryButton
                            type="button"
                            onClick={selectImage}
                            className="mt-2"
                        >
                            Select New Image
                        </PrimaryButton>

                        <InputError message={errors.photo} className="mt-2" />
                    </div>
                </div>

                {progress && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${progress.percentage}%` }}
                        ></div>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing || !data.photo}>
                        Save
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
