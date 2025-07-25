import type { PageLoad } from './$types';

// 페이지 설정
export const prerender = true; // 정적 생성
export const ssr = true; // 서버 사이드 렌더링

// 더미 데이터
const dummyPosts = [
	{
		id: 1,
		title: 'SvelteKit 시작하기',
		content: 'SvelteKit은 현대적인 웹 개발 프레임워크입니다.',
		author: '김개발',
		date: '2024-01-15',
		tags: ['svelte', 'tutorial']
	},
	{
		id: 2,
		title: 'TypeScript와 함께하는 개발',
		content: 'TypeScript를 사용하면 더 안전한 코드를 작성할 수 있습니다.',
		author: '이타입',
		date: '2024-01-10',
		tags: ['typescript', 'javascript']
	},
	{
		id: 3,
		title: '반응형 웹 디자인',
		content: '모든 디바이스에서 완벽하게 동작하는 웹사이트를 만들어보세요.',
		author: '박디자인',
		date: '2024-01-05',
		tags: ['css', 'responsive']
	}
];

const dummyCategories = [
	{ id: 1, name: '프론트엔드', count: 15 },
	{ id: 2, name: '백엔드', count: 8 },
	{ id: 3, name: '디자인', count: 5 },
	{ id: 4, name: 'DevOps', count: 3 }
];

const dummyWeather = {
	city: 'Seoul',
	temperature: 22,
	condition: '맑음',
	humidity: 65,
	windSpeed: 3.2
};

// 페이지 로드 함수
export const load: PageLoad = async ({ url, depends }) => {
	// 의존성 추적 (개발 중 자동 새로고침용)
	depends('app:homepage');

	// URL 파라미터 처리
	const searchQuery = url.searchParams.get('q') || '';
	const page = Number(url.searchParams.get('page')) || 1;
	const category = url.searchParams.get('category') || '';

	// 검색 필터링
	let filteredPosts = dummyPosts;
	if (searchQuery) {
		filteredPosts = dummyPosts.filter(
			(post) =>
				post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
		);
	}

	// 카테고리 필터링 (간단한 예시)
	if (category) {
		filteredPosts = filteredPosts.filter((post) =>
			post.tags.some((tag) => tag.toLowerCase().includes(category.toLowerCase()))
		);
	}

	// 페이지네이션
	const postsPerPage = 2;
	const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
	const startIndex = (page - 1) * postsPerPage;
	const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

	// 추천 게시물 (최신 2개)
	const featuredPosts = dummyPosts.slice(0, 2);

	// 사용자 데이터 (조건부)
	const userId = url.searchParams.get('user');
	let userData = null;
	if (userId) {
		userData = {
			id: userId,
			name: '사용자' + userId,
			email: `user${userId}@example.com`,
			joinDate: '2023-12-01',
			postCount: Math.floor(Math.random() * 20) + 1
		};
	}

	// 메타데이터 설정
	const pageTitle = searchQuery ? `검색: ${searchQuery} | SvelteKit 블로그` : 'SvelteKit 블로그';
	const pageDescription = searchQuery
		? `"${searchQuery}"에 대한 검색 결과`
		: 'SvelteKit으로 만든 멋진 블로그';

	// 통계 데이터
	const stats = {
		totalPosts: dummyPosts.length,
		totalViews: 1234,
		totalUsers: 45,
		lastUpdated: new Date().toLocaleDateString('ko-KR')
	};

	return {
		// 메인 데이터
		posts: paginatedPosts,
		totalPosts: filteredPosts.length,
		featuredPosts,
		categories: dummyCategories,
		weather: dummyWeather,

		// 페이지네이션
		currentPage: page,
		totalPages,
		hasNextPage: page < totalPages,
		hasPrevPage: page > 1,

		// 검색 및 필터
		searchQuery,
		category,

		// 사용자 데이터
		userData,

		// 통계
		stats,

		// 메타데이터
		meta: {
			title: pageTitle,
			description: pageDescription,
			keywords: ['svelte', 'sveltekit', 'typescript', 'blog']
		},

		// 페이지 상태
		timestamp: new Date().toISOString(),
		loadTime: Math.random() * 100 + 50 // 로딩 시간 시뮬레이션 (ms)
	};
};
