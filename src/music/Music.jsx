import { createContext, useContext, useReducer } from "react"
import { songList } from "./constants"

const PlayerContext = createContext(null)
const PlayerDispatchContext = createContext(null)

const controlModes = [
    "Not Replaying", "Replaying All", "Replaying One"
]


const PlayerProvider = ({ children }) => {
    const initialData = {
        songs: songList,
        selectedSong: null,
        controlModes,
        currentMode: 0
    };

    const [data, dispatch] = useReducer(songsReducer, initialData);

    return (
        <PlayerContext.Provider value={data}>
            <PlayerDispatchContext.Provider value={dispatch}>
                {children}
            </PlayerDispatchContext.Provider>
        </PlayerContext.Provider>
    );
}

const usePlayerContext = () => {
    const data = useContext(PlayerContext);
    const dispatch = useContext(PlayerDispatchContext);
    if (!data || !dispatch) {
        const errorMessage = 'usePlayerContext must be used within a PlayerProvider';
        throw Error(errorMessage);
    }
    return [data, dispatch]
}



const songsReducer = (data, action) => {
    const songs = data.songs;
    let currentSongIndex = null;
    if (data.selectedSong) {
        currentSongIndex = songs.findIndex(s => s.id === data.selectedSong.id);
    }
    switch (action.type) {
        case Actions.SONG_SELECTED:
            return {
                ...data,
                selectedSong: action.selected
            }

        case Actions.CHANGE_CONTROL_MODE:
            let nextMode = action.mode;
            if (nextMode === controlModes.length) {
                nextMode = 0;
            }
            return {
                ...data,
                currentMode: nextMode
            }

        case Actions.CHOOSE_NEXT:
            if (currentSongIndex == null) {
                window.alert('No song selected')
                return data;
            }
            let next = data.selectedSong
            switch (data.currentMode) {
                case 0:
                    if (currentSongIndex === songs.length - 1) {
                        next = null
                    } else {
                        next = songs[currentSongIndex + 1]
                    }
                    break;
                case 1:
                    if (currentSongIndex === songs.length - 1) {
                        next = songs[0]
                    } else {
                        next = songs[currentSongIndex + 1]
                    }
                    break;

                case 2:
                    break;

            }
            return {
                ...data,
                selectedSong: next
            }

        case Actions.CHOOSE_PREV:
            if (currentSongIndex == null) {
                window.alert('No song selected')
                return data;
            }

            let prevSong = data.selectedSong
            switch (data.currentMode) {
                case 0:
                    if (currentSongIndex > 0) {
                        prevSong = songs[currentSongIndex - 1]
                    }
                    break;
                case 1:
                    if (currentSongIndex > 0) {
                        prevSong = songs[currentSongIndex - 1]
                    } else {
                        prevSong = songs[songs.length - 1]
                    }
                    break;

                case 2:
                    break;
            }
            return {
                ...data,
                selectedSong: prevSong
            }



        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const Actions = {
    SONG_SELECTED: "Player/Song_selected",
    CHANGE_CONTROL_MODE: "Player/Change_Control_Mode",
    CHOOSE_NEXT: "Player/Next_Song",
    CHOOSE_PREV: "Player/Prev_Song"
}

function ControlBar() {
    const [{ selectedSong, currentMode, controlModes }, dispatch] = usePlayerContext()

    let controlBarTitle = ''
    if (selectedSong) {
        controlBarTitle = `${selectedSong.author} - ${selectedSong.title}`
    }

    const handlePrev = () => {
        dispatch({
            type: Actions.CHOOSE_PREV
        })
    }
    const handleNext = () => {
        dispatch({
            type: Actions.CHOOSE_NEXT
        })
    }
    const handleControlMode = () => {
        dispatch({
            type: Actions.CHANGE_CONTROL_MODE,
            mode: currentMode + 1
        })
    }

    return (
        <div className="text-center mb-3">
            <h6>{controlBarTitle}</h6>
            <button type="button"
                className="btn btn-light m-1"
                onClick={handlePrev}>
                Previous
            </button>

            <button type="button"
                className="btn btn-light m-1"
                onClick={handleNext}
            >
                Next
            </button>
            <button type="button"
                className="btn btn-light m-1"
                onClick={handleControlMode}
            >
                {controlModes[currentMode]}
            </button>
        </div>
    )
}

function SongTitle({ title, active }) {
    return <h5 className={`${active ? "text-primary" : ""}`}>{title}</h5>
}

function Song({ song, active }) {
    const [_, dispatch] = usePlayerContext()

    const selectCurrentSong = () => {
        dispatch({
            type: Actions.SONG_SELECTED,
            selected: song
        })
    }

    return (
        <li className="list-group-item"
            style={{ cursor: "pointer" }}
            onClick={selectCurrentSong}>
            <SongTitle title={song.title} active={active} />
            <h6>{song.author}</h6>
        </li>
    )
}

function Songs() {
    const [{ songs, selectedSong }] = usePlayerContext()
    const isSelected = (song) => {
        if (selectedSong) {
            return selectedSong.id === song.id
        }
        return false
    }
    const songList = songs.map(song => (
        <Song key={song.id} song={song} active={isSelected(song)} />
    ))

    return (
        <ul className="my-2 list-group list-group-item-dark">{songList}</ul>
    )
}


export default function MusicApp() {
    return (
        <div className="mt-5 row justify-content-center">
            <div className="col-md-8 bg-dark text-light">
                <PlayerProvider>
                    <Songs />
                    <ControlBar />
                </PlayerProvider>
            </div>
        </div>
    )
}