import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface Props {
    title: string;
    content?: string;
    img: string;
}

const ErrorMessage = ({title, content, img}: Props) => {
    return (
        <div className={`flex flex-col items-center justify-center ${inter.className}`}>
            <img
                className="w-80 h-auto mb-6"
                src={img}
                alt="Access Denied"
            />
            <div className="text-xl text-gray-800 mb-2">
                {title}
            </div>
            <div className="text-md text-gray-600">
                {content}
            </div>
        </div>
    );
};

export default ErrorMessage;