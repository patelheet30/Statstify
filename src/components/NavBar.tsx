import { Search } from "lucide-react";

const Navbar = () => {
    return (
        <nav>
            <ul className="place-content-between flex flex-row">
                <li>
                    <img src={`/static/logo.png`} alt="logo" className="size-14"/>
                </li>
                <li className="p-2">
                    <div id="searchbar" className="flex flex-row space-x-4 border p-2 bg-zinc-800 rounded-full min-w-4xl">
                        <Search size={24} />
                        <input type="text" placeholder="What do you want to look up?" className="min-w-3xl"/>
                    </div>
                </li>
                <li>
                    <img 
                        src="https://i.scdn.co/image/ab67757000003b82b5edff47fcab2caae1c2c0ce" 
                        alt="logo" 
                        className="size-14 border-8 rounded-full border-zinc-700"
                    />
                </li>
            </ul>
        </nav>
    );
} 

export default Navbar;