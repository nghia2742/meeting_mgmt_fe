export const getCookieValue = (cookies: string, cookieName: string) => {
    const cookie = cookies.split(';').find((c) => c.trim().startsWith(`${cookieName}=`));
    return cookie ? cookie.split('=')[1] : null;
};