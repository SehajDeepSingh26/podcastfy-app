import { useState } from 'react';
import axios from 'axios';

function App() {
    const [url, setUrl] = useState('');
    const [audioFileUrl, setAudioFileUrl] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const handleGeneratePodcast = async () => {
        setLoading(true); // Set loading to true when the request starts
        try {
            const response = await axios.post(
                'https://v2gtdl5d-5000.inc1.devtunnels.ms/generate-podcast',
                { urls: [url] },
                { responseType: 'blob' } // Important to specify response type as blob
            );

            // Create a URL for the audio file
            const audioUrl = window.URL.createObjectURL(new Blob([response.data]));
            setAudioFileUrl(audioUrl);
        } catch (error) {
            console.error("Error generating podcast:", error);
        } finally {
            setLoading(false); // Set loading to false when the request ends
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Podcast Generator</h1>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter webpage URL"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleGeneratePodcast}
                    disabled={loading} // Disable the button while loading
                    className={`w-full py-2 rounded-lg transition ${
                        loading
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {loading ? 'Generating...' : 'Generate Podcast'}
                </button>
                {loading && (
                    <div className="mt-4 text-blue-500 font-medium">
                        Loading... Please wait while we process your request.
                    </div>
                )}
                {audioFileUrl && !loading && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Podcast Audio:</h2>
                        <audio controls src={audioFileUrl} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
