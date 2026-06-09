import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions = {
    position: 'top-right',
    autoClouse: '2000',
    closeOnClick: 'true'
}

const notification = {
    success: (message) => {
        toast.success(message, {...defaultOptions})
    },

    error: (message) => {
        toast.error(message, {...defaultOptions})
    },

    warning: (message) => {
        toast.warning(message, {...defaultOptions})
    }
}

export default notification