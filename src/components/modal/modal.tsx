import MuiModal from '@mui/material/Modal'
import { useInfoStore } from 'src/store'
import { FaPlay, FaTimes, FaPause } from 'react-icons/fa'
import { useContext, useEffect, useState } from 'react';
import { Element } from 'src/interfaces/app.interface';
import ReactPlayer from 'react-player'
import { BiPlus, BiVolumeMute, BiVolumeFull } from 'react-icons/bi';
import { addDoc, collection } from 'firebase/firestore';
import { db } from 'src/firebase';
import { AuthContext } from 'src/context/auth.context';
import { useRouter } from 'next/router';

const Modal = () => {
    const base_url = process.env.NEXT_PUBLIC_API_DOMAIN as string;
    const api_key = process.env.NEXT_PUBLIC_API_KEY as string;

    const { modal, setModal, currentMovie } = useInfoStore()
    const [trailer, setTrailer] = useState<string>('')
    const [muted, setMuted] = useState<boolean>(true)
    const [playing, setPlaying] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { user } = useContext(AuthContext)
    const router = useRouter()

    const api = `${base_url}/${currentMovie?.media_type == 'tv' ? 'tv' : 'movie'}/${currentMovie?.id}/videos?api_key=${api_key}&language=en-US`

    useEffect(() => {
        const fetchVideoData = async () => {
            const data = await fetch(api).then(res => res.json())

            if (data?.results) {
                const index = data.results.findIndex((el: Element) => el.type == 'Trailer')
                setTrailer(data?.results[index]?.key)
            }
        }
        fetchVideoData()
    }, [currentMovie])

    const handleClose = () => {
        setModal(false)
    }

    const addProductList = async () => {
        setIsLoading(true)
        try {
            await addDoc(collection(db, 'list'), {
                userId: user?.uid,
                product: currentMovie,
            });
            setIsLoading(false)
            router.replace(router.asPath)
        } catch (e) {
            setIsLoading(false)
            console.log(e)
        }
    }

    return (
        <MuiModal open={modal} onClose={handleClose} className='fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll scrollbar-hide'>
            <>
                <button onClick={handleClose} className='modelButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818]'><FaTimes /></button>
                <div className=' relative pt-[55%]'>
                    <ReactPlayer url={`https://www.youtube.com/watch?v=${trailer}`} playing={playing} width={'100%'} height={'100%'} style={{ position: 'absolute', top: 0, left: 0, }} muted={muted} />
                    <div className='absolute bottom-10 flex w-full items-center justify-between px-18'>
                        <div className='flex space-x-2'>
                            <button onClick={() => setPlaying(prev => !prev)} className=' flex items-center gap-x-2 px-6 py-2 rounded bg-white text-xl font-bold text-black transition hover:bg-[#e6e6e6]'>
                                {playing ? (
                                    <><FaPause className='h-7 w-7 text-black' />Pause</>
                                ) : (
                                    <><FaPlay className='h-7 w-7 text-black' />Play</>
                                )}
                            </button>
                            <button className='modelButton' onClick={addProductList}>
                                {isLoading ? '...' : <BiPlus />}
                            </button>
                            <button className='modelButton' onClick={() => setMuted(prev => !prev)}>{muted ? <BiVolumeMute className='w-7 h-7' /> : <BiVolumeFull className='w-7 h-7' />}</button>
                        </div>
                    </div>
                </div>

                <div className='flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8'>
                    <div className='space-y-6 text-lg'>
                        <h1 className='font-[600] text-3xl'>{currentMovie?.title || currentMovie?.name || currentMovie?.original_name}</h1>
                        <div className='flex items-center space-x-2 text-sm'>
                            <p className='font-semibold text-green-400'>{currentMovie!.vote_average * 10}% Match</p>
                            <p className='font-light'>{currentMovie?.release_date}</p>
                            <div className='flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs'>HD</div>
                        </div>

                        <div className='flex flex-col gap-x-10 gap-y-4 font-light md:flex-row'>
                            <p className='w-5/6'>{currentMovie?.overview}</p>
                            <div className='flex flex-col space-y-3 text-sm'>
                                <div>
                                    <span className='text-[gray]'>Original language:</span> {currentMovie?.original_language}
                                </div>

                                <div>
                                    <span className='text-[gray]'>Total votes:</span> {currentMovie?.vote_count}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </MuiModal>
    )
}

export default Modal