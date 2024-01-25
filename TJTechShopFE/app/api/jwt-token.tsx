"use server"

import { cookies } from 'next/headers';


export async function getTokenClaims(): Promise<any> {
    try {
        const response = await fetch(`https://tjtechbe.azurewebsites.net/token`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${cookies().get('access_token_cookie')?.value}`,
            }
        })
        if (response.status == 200) {
            return response.json();
        } else {
            return
        }
    } catch (error) {
        return;
    }
}

export const logout = async (): Promise<any> => {
    const response = await fetch(`https://tjtechbe.azurewebsites.net/logout`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${cookies().get('access_token_cookie')?.value}`,
        }
    });
    return response.json();
}
