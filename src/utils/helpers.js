import { toast } from "react-hot-toast"

export const getSuccessToast = ( description) => {
    toast.success(description, {
        duration: 3000,
        style: {
            borderRadius: '12px',
            background: '#10b981',
            color: '#fff',
            maxWidth: '400px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
        },
    });
}

export const getErrorToast = (err) => {
    toast.error(err?.response?.data?.message || err?.message || "Something went wrong!", {
        duration: 3000,
        style: {
            borderRadius: '12px',
            background: '#dc2626',
            color: '#fff',
            maxWidth: '400px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
        },
    });
}


export const getWarningToast = (description) => {
    toast.error(description, {
        duration: 3000,
        style: {
            borderRadius: '12px',
            background: '#dc2626',
            color: '#fff',
            maxWidth: '400px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
        },
    });
}

export const getInfoToast = (description) => {
    toast.error(description, {
        duration: 3000,
        style: {
            borderRadius: '12px',
            background: '#dc2626',
            color: '#fff',
            maxWidth: '400px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
        },
    });
}