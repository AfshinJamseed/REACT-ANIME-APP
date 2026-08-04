import MovieCard from '../components/MovieCard';
import { useState, useEffect } from 'react';
import '../css/Home.css'
import { searchAnimes, getPopularAnimes } from '../services/api';

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [Animes, setAnimes] = useState([]);
    const [error, setError] = useState(null);
    const [noResults, setNoResults] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularAnimes = async () => {
            try {
                const popular = await getPopularAnimes();
                setAnimes(popular);
                setNoResults(false);
            } catch (err) {
                console.log(err)
                setError("Failed to load Animes")
            } finally {
                setLoading(false);
            }
        }
        loadPopularAnimes();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return
        if (loading) return
        setLoading(true)
        setError(null)
        try {
            const searchResults = await searchAnimes(searchQuery);
            setAnimes(searchResults);
            setNoResults(searchResults.length === 0);
        } catch (err) {
            setError("Search failed. Please try again.");
            setNoResults(false);
            console.log(err)
        } finally {
            setLoading(false);
        }
    }

    const handleClear = async () => {
        setSearchQuery("");
        setError(null);
        setNoResults(false);
        setLoading(true);
        try {
            const popular = await getPopularAnimes();
            setAnimes(popular);
        } catch (err) {
            console.log(err);
            setError("Failed to load Animes");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="home">
                <form onSubmit={handleSearch} className='search-form'>
                    <input
                        type="text"
                        placeholder='Search for Animes(naruto, one piece, etc)...'
                        className='search-input'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />

                    <button type='submit' className='search-button'>Search 🔎</button>
                    {searchQuery && <button type='button' className='clear-button' onClick={handleClear}>Clear</button>}
                </form>

                {error && <div className='error-message'>{error}</div>}
                {noResults && !loading && <div className='error-message'>No results for "{searchQuery}"</div>}

                {loading ? <div className='loading'>Loading...</div> :
                    <div className="anime-grid">
                        {Animes.map((movie) => {
                            return (<MovieCard movie={movie} key={movie.mal_id} />)
                        })}
                    </div>
                }
            </div>
        </>
    )
}
export default Home;