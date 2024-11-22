export default function Info() {
    {/* Gives information about how to collect Spotify Extended History data from Spotify */ }
    return (
        <div className="max-w-4xl flex flex-col m-auto">
            <header className="mb-8 mt-12">
                <h1 className="text-4xl"><a href="/" className="text-spotify-green hover:underline underline-offset-2">Statstify</a> - How to get your Spotify Data</h1>
            </header>
            <main>
                <ol className="list-decimal list-inside space-y-[1px]">
                    <li>
                        Go to your Spotify <a
                            href="https://www.spotify.com/uk/account/overview/"
                            target="_blank" rel="noopener" className="text-spotify-green hover:underline underline-offset-2">
                            Accounts
                        </a> page
                    </li>
                    <li>
                        Scroll down to the <strong>Privacy settings</strong> section
                    </li>
                    <li>
                        Scroll down and select <strong>Account Data</strong> and <strong>Extended Streaming History</strong>
                    </li>
                    <li>
                        Click on <strong>Request Data</strong> under <strong>Download your data</strong>
                    </li>
                    <li>
                        Spotify will shortly send you an email to <strong>verify the request</strong>
                    </li>
                    <li>
                        Once verified, Spotify will send you another email with a link to <strong>download your data</strong>. Account Data should arrive in <strong>2-5 days</strong>, and Extended Streaming History in <strong>30 days.</strong>
                    </li>
                    <li>
                        Download the ZIP file and without unzipping, upload it to <strong>Statstify</strong>
                    </li>
                </ol>
            </main>
        </div>
    );
}