import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Header, Hero, Modal, Row, SubscriptionPlan } from 'src/components';
import { getList } from 'src/helpers/lists';
import { IMovie, MyList, Product } from 'src/interfaces/app.interface';
import { API_REQUEST } from 'src/services/api.service';
import { useInfoStore } from 'src/store';

export default function Home({
	trending, nowPlaying, popular, topRated, upcoming, products, subscription, list
}: HomeProps): JSX.Element {
	const { modal } = useInfoStore();

	if (!subscription.length) return <SubscriptionPlan products={products} />

	return (
		<div className={`relative min-h-screen ${modal && '!h-screen overflow-hidden'}`}>
			<Head>
				<title>Home - SardorDev</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/logo.svg' />
			</Head>
			<Header />
			<main className='relative pl-4 pb-24 lg:space-y-24 lg:pl-16'>
				<Hero trending={trending} />
				<section>
					<Row movies={nowPlaying} title='New Playing' />
					<Row movies={popular.reverse()} title='Popular' isBig={true} />
					<Row movies={topRated} title='Top Rated' />
					<Row movies={upcoming} title='Upcoming' isBig={true} />

					{list.length ? <Row movies={list} title='My List' /> : null}
				</section>
			</main>
			{modal && <Modal />}
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ req }) => {
	const user_id = req.cookies.user_id

	if (!user_id) {
		return {
			redirect: { destination: '/auth', permanent: false }
		}
	}

	const [trending, topRated, popular, nowPlaying, upcoming, products, subscription] = await Promise.all([
		fetch(API_REQUEST.trending).then(res => res.json()),
		fetch(API_REQUEST.top_rated).then(res => res.json()),
		fetch(API_REQUEST.popular).then(res => res.json()),
		fetch(API_REQUEST.now_playing).then(res => res.json()),
		fetch(API_REQUEST.upcoming).then(res => res.json()),

		fetch(API_REQUEST.products_list).then(res => res.json()),
		fetch(`${API_REQUEST.subscription}/${user_id}`).then(res => res.json()),
	])

	const myList: MyList[] = await getList(user_id);

	return {
		props: {
			trending: trending.results,

			nowPlaying: nowPlaying.results,
			popular: popular.results,
			topRated: topRated.results,
			upcoming: upcoming.results,

			products: products.products.data,
			subscription: subscription.subscription.data,
			list: myList.map(c => c.product),
		},
	};
};

interface HomeProps {
	trending: IMovie[];

	topRated: IMovie[];
	popular: IMovie[];
	nowPlaying: IMovie[];
	upcoming: IMovie[];

	products: Product[]
	subscription: string[]
	list: IMovie[]
}