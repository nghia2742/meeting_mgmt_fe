import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FileIcon, Loader, Plus, X } from 'lucide-react';
import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '@/components/timePicker/TimePicker';
import { useFilteredUsers } from '@/hooks/useUser';
import Image from 'next/image';
import apiClient from '@/lib/apiClient';
import { useMeetingStore } from '@/stores/meetingStore';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { useDropzone } from 'react-dropzone';
import { isImage } from '@/utils/image.util';
import { getExtension } from '@/utils/get-extension.util';
import { useAllMeeting } from '@/hooks/useMeeting';
import { useRouter } from 'next/router';
import { invalidateDateTime } from '@/utils/datetime.util';
import { useDebounce } from '@/hooks/useDebounce';

export interface FilePreview {
    preview: string;
    name: string;
    type: string;
}

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    tag: z.string().optional(),
    description: z.string().optional(),
    startTime: z.date(),
    endTime: z.date(),
    location: z.string(),
    note: z.string().optional(),
    attendees: z.array(z.string()).optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

// const inter = Inter({ subsets: ['latin'] });

export default function AddMeetingForm() {
    const { setIsOpenForm } = useMeetingStore();
    const { refetch: refetchAllMeeting } = useAllMeeting();
    const { push } = useRouter();

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            tag: '',
            description: '',
            startTime: new Date(),
            endTime: new Date(),
            location: '',
            note: '',
            attendees: [],
        },
    });
    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        setError,
        clearErrors,
    } = form;

    // Tags
    const [listTags, setListTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>('');

    // Attendees
    const [listAttendees, setListAttendees] = useState<string[]>([]);
    const [attendeeInput, setAttendeeInput] = useState('');
    const debounceAttendeeInput = useDebounce(attendeeInput);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const { data, isLoading, error } = useFilteredUsers(debounceAttendeeInput);

    // Files
    const [files, setFiles] = useState<FilePreview[]>([]);
    const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // HANDLE TAGS
    const handleOnChangeTag = (e: ChangeEvent<HTMLInputElement>) => {
        clearErrors('tag');
        setTagInput(e.target.value);
    };

    const handleAddTag = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const newTag = tagInput;

        // Check empty input
        if (!newTag) return;

        // Check duplicated input
        const isDuplicated = listTags.find(
            (tag) => tag.toLowerCase() === tagInput.toLowerCase()
        );
        if (isDuplicated) return setError('tag', { message: 'Duplicated tag' });

        // Pass and save the new tag
        setListTags((prevTags) => [...prevTags, newTag]);
        setValue('tag', [...listTags, newTag].join(', '));
        setTagInput('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const updatedTags = listTags.filter((tag) => tag !== tagToRemove);
        setListTags(updatedTags);
        setValue('tag', updatedTags.join(', '));
        setTagInput('');
    };

    // HANDLE ATTENDEES
    const handleOnChangeAttendee = (e: ChangeEvent<HTMLInputElement>) => {
        let targetValue = e.target.value;
        setIsPopoverOpen(!!targetValue);
        setAttendeeInput(targetValue);
        clearErrors('attendees');
    };

    const handleOnClickAddAttendee = (email: string) => {
        const newAttendee = email;
        if (!newAttendee) return;
        const isDuplicated = listAttendees.find(
            (attendee) => attendee.toLowerCase() === email.toLowerCase()
        );
        if (isDuplicated) {
            setIsPopoverOpen(false);
            return setError('attendees', { message: 'Duplicated attendee' });
        }
        setListAttendees((prevAttendees) => [...prevAttendees, newAttendee]);
        setValue('attendees', [...listAttendees, newAttendee]);
        setAttendeeInput('');
        setIsPopoverOpen(false);
    };

    const handleRemoveAttendee = (attendeeToRemove: string) => {
        const updatedAttendees = listAttendees.filter(
            (attendee) => attendee !== attendeeToRemove
        );
        setListAttendees(updatedAttendees);
        setValue('attendees', updatedAttendees);
        setAttendeeInput('');
    };

    // HANDLE FILES
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploading(true);

        acceptedFiles.forEach((file) => {
            setFiles((prevFiles) => [
                ...prevFiles,
                {
                    preview: URL.createObjectURL(file),
                    name: file.name,
                    type: file.type,
                },
            ]);
        });
        setAcceptedFiles(acceptedFiles);
        setUploading(false);
    }, []);

    const onDeleteImg = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const onCloseModal = () => {
        setIsOpen(!isOpen);
        setFiles([]);
    };

    const onAddNewFile = async () => {
        if (files.length === 0 || acceptedFiles.length === 0) {
            alert('Please upload at least one file!');
        } else {
            setIsOpen(!isOpen);
        }
    };

    const createFile = async (acceptedFiles: File[], meetingId: string) => {
        for (let acceptedFile of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', acceptedFile);
            const response = await apiClient.post(
                '/cloudinary/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (response && response.data) {
                const responseCreateFile = await apiClient.post('/files', {
                    name: acceptedFile.name,
                    type: getExtension(acceptedFile.name),
                    link: response.data.secure_url,
                    publicId: response.data.public_id,
                    meetingId,
                });
            }
        }
    };

    // HANDLE SUBMIT
    function onSubmit(data: FormSchemaType) {
        setIsSubmit(true);
        if (invalidateDateTime(getValues('startTime'), getValues('endTime'))) {
            setError('startTime', {
                type: 'manual',
                message: 'Start time must be smaller than end time',
            });
            setError('endTime', {
                type: 'manual',
                message: 'End time must be greater than start time',
            });
            setIsSubmit(false);
            return;
        } else {
            clearErrors('startTime');
            clearErrors('endTime');
        }

        try {
            apiClient
                .post('/meetings', data)
                .then(async (response) => {
                    const meetingId = await response.data.id;
                    await createFile(acceptedFiles, meetingId);
                    setIsOpenForm();
                    setIsSubmit(false);
                    refetchAllMeeting();

                    toast({
                        title: 'Create successfully!',
                        variant: 'success',
                    });

                    // Redirect to meeting detail page
                    push(`/meeting/${meetingId}`);
                    
                })
                .catch((error) => {
                    setIsOpenForm();
                    setIsSubmit(false);
                    return toast({
                        title: error.response.data.message,
                        variant: 'destructive',
                    });
                });
        } catch (error: any) {
            console.error('Error uploading file:', error.response.data.message);
            toast({
                title: 'Uh oh! Something went wrong',
                description: error.response.data.message,
                variant: 'destructive',
            });
            onCloseModal();
        }
    }

    return (
        <Form {...form}>
            <form className={`px-5`} onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="block text-sm font-bold mb-2">
                                    Title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="tag"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel className="block text-sm font-bold mb-2">
                                    Tag
                                </FormLabel>
                                <FormControl>
                                    <div className="flex items-center">
                                        <Input
                                            type="text"
                                            placeholder="Tag"
                                            onChange={(e) =>
                                                handleOnChangeTag(e)
                                            }
                                            value={tagInput}
                                        />
                                        <Button
                                            disabled={!tagInput && true}
                                            className="ml-2"
                                            onClick={(e) => handleAddTag(e)}
                                        >
                                            + Add a tag
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                <div className="flex gap-2 flex-wrap mt-2">
                                    {listTags?.map((tag, index) => (
                                        <Badge key={index} variant="outline">
                                            {tag}
                                            <X
                                                className="ml-2 h-4 w-4 cursor-pointer"
                                                onClick={() =>
                                                    handleRemoveTag(tag)
                                                }
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
                    <FormField
                        control={control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel className="block text-sm font-bold mb-2">
                                    Start time
                                </FormLabel>
                                <Popover>
                                    <FormControl>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-[280px] justify-start text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? (
                                                    format(
                                                        field.value,
                                                        'PPP HH:mm:ss'
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        <div className="p-3 border-t border-border">
                                            <TimePicker
                                                setDate={field.onChange}
                                                date={field.value}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel className="block text-sm font-bold mb-2">
                                    End time
                                </FormLabel>
                                <Popover>
                                    <FormControl>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-[280px] justify-start text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? (
                                                    format(
                                                        field.value,
                                                        'PPP HH:mm:ss'
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                    </FormControl>
                                    <FormMessage />
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        <div className="p-3 border-t border-border">
                                            <TimePicker
                                                setDate={field.onChange}
                                                date={field.value}
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="mb-4">
                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="block text-sm font-bold mb-2">
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter meeting description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="mb-4">
                    <FormField
                        control={control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="block text-sm font-bold mb-2">
                                    Location
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter meeting location"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="mb-4">
                    <FormField
                        control={control}
                        name="note"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="block text-sm font-bold mb-2">
                                    Note
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter meeting notes"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="mb-4">
                    <FormField
                        control={control}
                        name="attendees"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel className="block text-sm font-bold mb-2">
                                    Attendees
                                </FormLabel>
                                <FormControl>
                                    <div className="flex items-center">
                                        <div className="relative w-full">
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    placeholder="Attendee"
                                                    onChange={handleOnChangeAttendee}
                                                    value={attendeeInput}
                                                />
                                                {attendeeInput && (
                                                    <X
                                                        className="absolute right-2 top-[30%] h-4 w-4 cursor-pointer"
                                                        onClick={() => {
                                                            setIsPopoverOpen(
                                                                false
                                                            );
                                                            setAttendeeInput(
                                                                ''
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            {isPopoverOpen && (
                                                <ul className="absolute w-full bg-white gap-1 shadow-sm border mt-2 rounded-md z-50">
                                                    {isLoading && (
                                                        <li className="flex items-center justify-center gap-2 px-4 py-1 rounded-md text-sm">
                                                            Loading...
                                                        </li>
                                                    )}

                                                    {!data && error && (
                                                        <li className="flex items-center justify-center gap-2 px-4 py-1 rounded-md text-sm">
                                                            No data
                                                        </li>
                                                    )}
                                                    {data?.map(
                                                        (attendee: any) => (
                                                            <li
                                                                key={
                                                                    attendee.id
                                                                }
                                                                className="flex items-center gap-2 hover:bg-muted cursor-pointer px-4 py-1 rounded-md text-sm"
                                                                onClick={() =>
                                                                    handleOnClickAddAttendee(
                                                                        attendee.email
                                                                    )
                                                                }
                                                            >
                                                                <Image
                                                                    className="border rounded-full w-8 h-8"
                                                                    src={
                                                                        '/images/logoCLT.png'
                                                                    }
                                                                    width={100}
                                                                    height={100}
                                                                    alt="avt"
                                                                />
                                                                {attendee.email}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                <div className="flex gap-2 flex-wrap mt-2">
                                    {listAttendees?.map((attendee, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="flex gap-1 hover:bg-muted"
                                        >
                                            <Image
                                                className="rounded-full w-8 h-8"
                                                src={'/images/logoCLT.png'}
                                                width={100}
                                                height={100}
                                                alt="avt"
                                            />
                                            {attendee}
                                            <X
                                                className="ml-2 h-4 w-4 cursor-pointer"
                                                onClick={() =>
                                                    handleRemoveAttendee(
                                                        attendee
                                                    )
                                                }
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="files"
                    >
                        Attached files
                    </label>
                    <div className="flex items-center flex-wrap">
                        {files.map((file, index) => (
                            <div
                                key={file.name}
                                className="p-2 flex flex-col items-center relative"
                            >
                                {isImage(file.name) ? (
                                    <Image
                                        src={file.preview}
                                        alt={file.name}
                                        width={0}
                                        height={0}
                                        sizes="100px"
                                        className="w-20 h-20 object-cover rounded-md"
                                        title={file.name}
                                    />
                                ) : (
                                    <FileIcon
                                        width={72}
                                        height={72}
                                        className="text-gray-500 mb-2"
                                    />
                                )}
                                <p className="text-xs text-gray-500 max-w-[90px] truncate">
                                    {file.name}
                                </p>
                                <button
                                    onClick={() => onDeleteImg(index)}
                                    className="cursor-pointer absolute text-[12px] right-[-2px] top-[-4px] bg-black text-white px-2 py-0.5 rounded-full"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                        <Dialog open={isOpen} onOpenChange={onCloseModal}>
                            <DialogTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    className="border-2 border-dashed"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add file
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add new file</DialogTitle>
                                </DialogHeader>
                                <div
                                    {...getRootProps()}
                                    className="flex flex-col items-center justify-center 
                    border-2 border-dashed border-gray-300 p-6 rounded-md 
                    cursor-pointer hover:border-black-500 transition duration-300"
                                >
                                    <Input multiple {...getInputProps()} />
                                    <FileIcon
                                        size={40}
                                        className="text-gray-500 mb-2"
                                    />
                                    <p className="text-gray-500">
                                        Drag or drop file here
                                    </p>
                                </div>
                                {uploading === true ? (
                                    <p>Loading...</p>
                                ) : (
                                    <div className="flex flex-wrap">
                                        <div className="flex flex-wrap items-center">
                                            {files.map((file, index) => (
                                                <div
                                                    key={file.name}
                                                    className="p-2 flex flex-col items-center relative"
                                                >
                                                    {isImage(file.name) ? (
                                                        <Image
                                                            src={file.preview}
                                                            alt={file.name}
                                                            width={0}
                                                            height={0}
                                                            sizes="100px"
                                                            className="w-20 h-20 object-cover rounded-md"
                                                        />
                                                    ) : (
                                                        <FileIcon
                                                            width={72}
                                                            height={72}
                                                            className="text-gray-500 mb-2"
                                                        />
                                                    )}
                                                    <p className="text-xs text-gray-500 max-w-[90px] truncate">
                                                        {file.name}
                                                    </p>
                                                    <button
                                                        onClick={() =>
                                                            onDeleteImg(index)
                                                        }
                                                        className="cursor-pointer absolute text-[12px] right-[-2px] top-[-4px] bg-black text-white px-2 py-0.5 rounded-full"
                                                    >
                                                        x
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <DialogFooter className="sm:justify-end">
                                    <div className="flex space-x-4 justify-end">
                                        <Button onClick={onAddNewFile}>
                                            Save
                                        </Button>
                                        <Button
                                            onClick={onCloseModal}
                                            type="button"
                                            variant="secondary"
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="flex flex-row-reverse gap-4 items-center">
                    <Button
                        variant="default"
                        disabled={isSubmit}
                        className="flex gap-2"
                    >
                        {isSubmit && <Loader className="animate-spin" />}
                        Save
                    </Button>
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpenForm();
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
