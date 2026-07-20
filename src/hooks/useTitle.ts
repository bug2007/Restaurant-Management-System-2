import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

type SetTitle = React.Dispatch<React.SetStateAction<string>>;

export default function useTitle(title: string) {
    const setTitle= useOutletContext<SetTitle>();

    useEffect(() => {
        setTitle(title)
    }, [title, setTitle])
}