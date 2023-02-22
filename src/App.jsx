import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }
    if (search === '') {
      setError('Can´t search for an empty movie')
      return
    }
    if (search.match(/^\d+$/)) {
      setError('You can´t search for a movie with a number')
      return
    }
    if (search.length < 3) {
      setError('The search must have at least 3 characters')
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }
}

function App () {
  const [sort, setSort] = useState(false)
  const { search, updateSearch, error } = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })

  const debouncedGetMovies = useCallback(
    debounce(search => {
      getMovies({ search })
    }, 300)
    , [getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }

  return (
    <div>
      <header>
        <h1 style={{ textAlign: 'center' }}>Movie searcher</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input onChange={handleChange} value={search} name='query' placeholder='Avengers, Star Wars, Avatar...' />
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Search</button>
        </form>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </header>

      <main style={{ marginTop: '2rem' }}>
        {
          loading ? <p>Loading...</p> : <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App
