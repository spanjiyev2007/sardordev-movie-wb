const base_url = process.env.NEXT_PUBLIC_API_DOMAIN as string;
const api_key = process.env.NEXT_PUBLIC_API_KEY as string;
const publik_domein = process.env.NEXT_PUBLIC_DOMAIN as string;

export const API_REQUEST = {
	trending: `${base_url}/trending/all/week?api_key=${api_key}&language=en-US`,
	now_playing: `${base_url}/movie/now_playing?api_key=${api_key}&language=en-US`,
	popular: `${base_url}/movie/popular?api_key=${api_key}&language=en-US`,
	top_rated: `${base_url}/movie/top_rated?api_key=${api_key}&language=en-US`,
	upcoming: `${base_url}/movie/upcoming?api_key=${api_key}&language=en-US`,

	products_list: `${publik_domein}/api/products`,
	subscription: `${publik_domein}/api/subscription`
};
