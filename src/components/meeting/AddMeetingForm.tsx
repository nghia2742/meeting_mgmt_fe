import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { ChangeEvent, MouseEvent, useState } from 'react';
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
import { useFilteredUsers } from '@/hooks/useMeeting';
import Image from 'next/image';
import apiClient from '@/lib/apiClient';
import { useMeetingStore } from '@/stores/meetingStore';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    tag: z.string(),
    description: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    location: z.string(),
    note: z.string(),
    attendees: z.array(z.string()),
    files: z.string(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function AddMeetingForm() {
    const { setIsOpenForm } = useMeetingStore();

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: 'Title test',
            tag: '',
            description: 'Desc',
            startTime: new Date(),
            endTime: new Date(),
            location: 'Location test',
            note: 'Notes',
            attendees: [],
            files: '',
        },
    });
    const { control, handleSubmit, setValue, setError, clearErrors } = form;
    const [listTags, setListTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>('');

    const [listAttendees, setListAttendees] = useState<string[]>([]);
    const [attendeeInput, setAttendeeInput] = useState<string>('');

    const [emailFetching, setEmailFetching] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const { data, isLoading, error } = useFilteredUsers(emailFetching);

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
        setIsPopoverOpen(targetValue !== '');
        setEmailFetching(targetValue);
        clearErrors('attendees');
        setAttendeeInput(targetValue);
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

    // HANDLE SUBMIT
    function onSubmit(data: FormSchemaType) {
        apiClient
            .post('/meetings', data)
            .then((response) => {
                setIsOpenForm();
                return toast({
                    title: 'Create successfully!',
                    variant: 'success',
                });
            })
            .catch((error) => {
                setIsOpenForm();
                console.error(error);
                return toast({
                    title: 'Something went wrong',
                    variant: 'destructive',
                });
            });

        // toast({
        //     title: 'You submitted the following values:',
        //     description: (
        //         <pre>
        //             <code>{JSON.stringify(data, null, 2)}</code>
        //         </pre>
        //     ),
        // });
    }

    return (
        <Form {...form}>
            <form
                className={`px-5`}
                onSubmit={handleSubmit(onSubmit)}
            >
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
                                                    onChange={
                                                        handleOnChangeAttendee
                                                    }
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
                                                <ul className="absolute w-full bg-white gap-1 shadow-sm border mt-2 rounded-md">
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
                    <div className="flex items-center">
                        <Badge className="mr-2 bg-sky-300">
                            Comming soon 👀
                        </Badge>
                        {/* <Button
                            className="ml-2"
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsOpenForm();
                            }}
                        >
                            + Add a file
                        </Button> */}
                    </div>
                </div>
                <div className="flex flex-row-reverse gap-4 items-center">
                    <Button variant="default" type="submit">
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
