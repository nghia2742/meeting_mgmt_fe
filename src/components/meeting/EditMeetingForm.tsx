import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader, X } from 'lucide-react';
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
import apiClient from '@/lib/apiClient';
import { useMeetingStore } from '@/stores/meetingStore';
import { invalidateDateTime } from '@/utils/datetime.util';
import { Meeting } from '@/types/meeting.type';
import { useRouter } from 'next/router';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    tag: z.string().optional(),
    description: z.string().optional(),
    startTime: z.date(),
    endTime: z.date(),
    location: z.string().min(1, 'Location is required'),
    note: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function EditMeetingForm({ meeting }: { meeting: Meeting }) {
    const { setIsOpenEditForm } = useMeetingStore();
    const [isSubmit, setIsSubmit] = useState(false);
    const { reload } = useRouter();
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: meeting.title,
            tag: meeting.tag,
            description: meeting.description,
            startTime: new Date(meeting.startTime),
            endTime: new Date(meeting.endTime),
            location: meeting.location,
            note: meeting.note,
        },
    });
    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        setError,
        clearErrors
    } = form;

    const currentMeeting = {
        title: meeting.title,
        tag: meeting.tag,
        description: meeting.description,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        location: meeting.location,
        note: meeting.note,
    }

    // Tags
    const tagToArray = meeting.tag!==''?meeting.tag.split(', '):[];
    const [listTags, setListTags] = useState(tagToArray);
    const [tagInput, setTagInput] = useState<string>('');

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

        let commitData: Partial<Meeting> = {
            title: data.title,
            tag: data.tag,
            description: data.description,
            note: data.note,
        }
        if (currentMeeting.location !== getValues('location')) {
            commitData['location'] = getValues('location')
        }
        if (currentMeeting.startTime.toString() !== getValues('startTime').toISOString()) {
            commitData['startTime'] = new Date(getValues('startTime').toISOString())
        }
        if (currentMeeting.endTime.toString() !== getValues('endTime').toISOString()) {
            commitData['endTime'] = new Date(getValues('endTime').toISOString())
        }

        try {
            apiClient
                .patch(`/meetings/${meeting.id}`, commitData)
                .then(async (response) => {
                    setIsOpenEditForm();
                    setIsSubmit(false);
                    reload();
                    toast({
                        title: 'Update successfully!',
                        variant: 'success',
                    });
                })
                .catch((error) => {
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
        }
    }

    return (
        <Form {...form}>
            <form className={`px-5`} onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-2">
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="block text-sm font-bold mb-2">
                                    Title  <span className='text-destructive ml-1'>*</span>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
                    <FormField
                        control={control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel className="block text-sm font-bold mb-1">
                                    Start time <span className='text-destructive ml-1'>*</span>
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
                                <FormLabel className="block text-sm font-bold mb-1">
                                    End time <span className='text-destructive ml-1'>*</span>
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

                <div className="mb-2">
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

                <div className="mb-2">
                    <FormField
                        control={control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="block text-sm font-bold mb-2">
                                    Location <span className='text-destructive ml-1'>*</span>
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
                <div className="mb-2">
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
                            setIsOpenEditForm();
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
