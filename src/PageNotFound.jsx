import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div>
            <h1>Page Not Found</h1>
            <br/>
            <Link to="/" className="mb-4 inline-block bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800">Return Home</Link>
        </div>
    );
}
