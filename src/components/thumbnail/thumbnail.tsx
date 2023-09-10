import Image from 'next/image';
import ReactStars from 'react-stars';
import { image_base } from 'src/helpers/constants';
import { ThumbnailProps } from './thumbnail.props';
import { useInfoStore } from 'src/store';

const Thumbnail = ({ movie, isBig = false }: ThumbnailProps) => {
	const { setModal, setCurrentMovie } = useInfoStore()

	const handleCurrentMovie = ()=>{
		setModal(true)
		setCurrentMovie(movie)
	}
	return (
        <div onClick={handleCurrentMovie} className={`${isBig ? 'h-[450px] md:h-[600px] min-w-[300px] md:min-w-[400px]' : 'h-[330px] md:h-[440px] min-w-[200px] md:min-w-[292px]'} relative cursor-pointer transition duration-200 ease-out md:hover:scale-110`}>
            <Image
                src={`${image_base}${movie?.backdrop_path || movie?.poster_path}`}
                alt={movie.title}
                fill
                className='rounded-t-sm md:rounded object-cover'
            />
            <div className="absolute left-0 right-0 bottom-0 top-0 bg-black/40 w-full h-full"/>
            <div className={`absolute bottom-5 left-3 right-3 ${isBig && 'bottom-7 left-5 right-4'}`}>
                <div className='flex items-center space-x-2'>
                    <ReactStars edit={false} value={movie.vote_average / 2} />
                    <p>({movie.vote_count})</p>
                </div>
                <h1 className='text-2xl font-bold md:text-4xl'>{movie?.title || movie?.name || movie?.original_name}</h1>
            </div>
        </div>
    )
};

export default Thumbnail;
