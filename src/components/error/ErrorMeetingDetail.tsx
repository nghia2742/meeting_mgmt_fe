import React from 'react';
import ErrorMessage from './ErrorMessage';
import MainLayout from '../main.layout';

interface ErrorMeetingDetailProps {
    statusCode: number;
}

const ErrorMeetingDetail = ({ statusCode }: ErrorMeetingDetailProps) => {
    if (statusCode === 500) {
        return (
            <MainLayout>
                <ErrorMessage
                    title="Not found this meeting"
                    img="/images/notfound.png"
                />
            </MainLayout>
        );
    }
    if (statusCode === 403) {
        return (
            <MainLayout>
                <ErrorMessage
                    title="You can't access this meeting"
                    content="Please make sure you're assigned to this meeting"
                    img="/images/restricted-area.png"
                />
            </MainLayout>
        );
    }
    return (
        <MainLayout>
            Error
        </MainLayout>
    );
};

export default ErrorMeetingDetail;
