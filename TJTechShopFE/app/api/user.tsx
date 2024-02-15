import { UserModel } from "../models/user"

export const login = async (data: { email: string, password: string }): Promise<any> => {
    const response = await fetch(`http://localhost:5000/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
    });
    if(response.status == 200) {
        return response.json();
    } else {
        return 
    }
    
}

export const getAllUsers = async (): Promise<UserModel[]> => {
    const response = await fetch(`http://localhost:5000/user`, {
        next: {
            revalidate: 0
        }
    });
    return response.json();
}

export const getUser = async (email: string): Promise<UserModel> => {
    const response = await fetch(`http://localhost:5000/user/${email}`);
    return response.json();
}

export const registerUser = async (user: UserModel): Promise<UserModel> => {
    const response = await fetch(`http://localhost:5000/user`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    return response.json();
}

export const updateUser = async (userData: UserModel, email: string): Promise<UserModel> => {
    const response = await fetch(`http://localhost:5000/user/${email}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    return response.json();
}

export const deleteUser = async (email: string): Promise<string> => {
    const response = await fetch(`http://localhost:5000/user/${email}`, {
        method: 'DELETE',
        body: JSON.stringify(email),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    return response.json();
}

export const sendPasswordResetCode = async (resetCode: {reset_code: string}, email: string): Promise<UserModel> => {
    const response = await fetch(`http://localhost:5000/user/reset-password/${email}`, {
        method: 'PUT',
        body: JSON.stringify(resetCode),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    return response.json();
}