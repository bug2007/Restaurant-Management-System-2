import useTitle from "../hooks/useTitle"
import { createOrder } from "../util/http"

export default function NewOrder() {
    useTitle('Create New Order')
    
    return (
        <>
        <p>New order</p>
        <button onClick={createOrder}>Send</button>
        </>
    )
}