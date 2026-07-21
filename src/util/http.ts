import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

interface LoginData  {
  userName: string;
  password: string;
}; 

interface GetEmployeesParams {
  signal: AbortSignal;
  page?: number;
  perPage?: number;
  search?: string;
  sort?: string;
}

export async function loginAdmin({userName, password}: LoginData) {
    const response = await fetch('https://bssrms.runasp.net/api/Auth/signIn', {
        method: 'POST',
        headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName,
            password
        })
    })

    if (!response.ok) {
        throw new Error('Login failed. Invalid credentials.')
    }
    return response.json()
}

export async function getEmployees({signal, page, perPage, search, sort}: GetEmployeesParams) {
    const token = localStorage.getItem('accessToken');

    const params = new URLSearchParams();
    if (page) params.append('Page', String(page));
    if (perPage) params.append('Per_Page', String(perPage));
    if (search) params.append('Search', search);
    if (sort) params.append('Sort', sort);

    const url = `https://bssrms.runasp.net/api/Employee/datatable?${params.toString()}`;
    
    const response = await fetch(url,{
        method: 'GET',
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
        },
        signal
    })

    if (!response.ok) {
        throw new Error('Failed to fetch employees.')
    }

    const result = await response.json()
    return result
} 

export async function getTables({signal, page, perPage, search, sort}: GetEmployeesParams) {
    const token = localStorage.getItem('accessToken');

    const params = new URLSearchParams();
    if (page) params.append('Page', String(page));
    if (perPage) params.append('Per_Page', String(perPage));
    if (search) params.append('Search', search);
    if (sort) params.append('Sort', sort);

    const url = `https://bssrms.runasp.net/api/Table/datatable?${params.toString()}`;
    
    const response = await fetch(url,{
        method: 'GET',
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
        },
        signal
    })

    if (!response.ok) {
        throw new Error('Failed to fetch tables.')
    }

    const result = await response.json()
    return result
} 

// export async function getAuthProfile() {
//     const token = localStorage.getItem('accessToken')
//     const response = await fetch('https://bssrms.runasp.net/api/Auth/profile', {
//         method: 'GET',
//         headers: {
//             'accept': 'text/plain',
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//         } 
//     )
//     if (!response.ok) {
//         throw new Error('Failed to fetch admin profile.')
//     }
//     const result = await response.json()
//     const { id, ...userInfo}= result.user
//     return userInfo;
// }
