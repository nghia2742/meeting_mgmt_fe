// src/MeetingPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { Attendee } from '@/types/attendee.type';
import { MeetingFile } from '@/types/meeting.file.type';
import { User } from '@/types/user.type';

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    section: {
        marginBottom: 5,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
    header: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    table: {
        width: 'auto',
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '33.33%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#d3d3d3',
    },
    tableCol: {
        width: '33.33%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    tableCellHeader: {
        margin: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableCell: {
        margin: 5,
        fontSize: 12,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginVertical: 10,
    },
    tableCellEmail: {
        margin: 5,
        fontSize: 12,
        color: "blue"
    },
});

interface Props {
    title: string;
    description: string;
    note: string;
    startTime: string;
    attendees: Attendee[];
    date: string;
    duration: string;
    location: string;
    files: MeetingFile[],
    createdBy: User | undefined
}

const MeetingPDF = ({ title, description, note, date, startTime, duration, attendees, location, files, createdBy }: Props) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Minutes of Meeting: {title}</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.section}>
                <Text style={styles.text}>Meeting Title: {title}</Text>
                <Text style={styles.text}>Meeting Date: {date}</Text>
                <Text style={styles.text}>Start time: {startTime}</Text>
                <Text style={styles.text}>Duration: {duration} minutes</Text>
                <Text style={styles.text}>Location: {location}</Text>
                <Text style={styles.text}>Organised by: {createdBy?.fullName}</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.section}>
                <Text style={styles.header}>Meeting Description</Text>
                <Text style={styles.text}>{description}</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.section}>
                <Text style={styles.header}>Meeting Attendees</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Full name</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Email Address</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Role</Text>
                        </View>
                    </View>
                    {attendees.map((attendee, index) => (
                        <View style={styles.tableRow} key={index}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{attendee.fullName}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCellEmail}>{attendee.email}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{createdBy?.id === attendee.id ? 'Organizer' : 'Attendee'}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.section}>
                <Text style={styles.header}>Meeting Notes</Text>
                <Text style={styles.text}>{note}</Text>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.section}>
                <Text style={styles.header}>Attached files</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>File Name</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Type</Text>
                        </View>
                        <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Link</Text>
                        </View>
                    </View>
                    {files.map((file, index) => (
                        <View style={styles.tableRow} key={index}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{file.name}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{file.type}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Link style={styles.tableCell} src={file.link}>View</Link>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </Page>
    </Document>
);

export default MeetingPDF;
