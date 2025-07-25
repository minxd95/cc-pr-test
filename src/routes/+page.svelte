<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data: PageData;

	// 검색 처리
	let searchInput = data.searchQuery;

	function handleSearch() {
		const params = new URLSearchParams($page.url.searchParams);
		if (searchInput) {
			params.set('q', searchInput);
		} else {
			params.delete('q');
		}
		params.delete('page'); // 검색 시 페이지 리셋
		goto(`?${params.toString()}`);
	}

	// 페이지네이션 처리
	function goToPage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`?${params.toString()}`);
	}

	// 카테고리 필터 처리
	function filterByCategory(categoryName: string) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('category', categoryName.toLowerCase());
		params.delete('page'); // 카테고리 변경 시 페이지 리셋
		goto(`?${params.toString()}`);
	}

	// 필터 클리어
	function clearFilters() {
		goto('/');
	}
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="keywords" content={data.meta.keywords.join(', ')} />
</svelte:head>

<div class="container">
	<!-- 헤더 섹션 -->
	<header class="header">
		<h1>🚀 SvelteKit 블로그</h1>
		<p class="subtitle">TypeScript와 함께하는 현대적인 웹 개발</p>

		<!-- 통계 정보 -->
		<div class="stats">
			<div class="stat-item">
				<span class="stat-number">{data.stats.totalPosts}</span>
				<span class="stat-label">게시물</span>
			</div>
			<div class="stat-item">
				<span class="stat-number">{data.stats.totalViews}</span>
				<span class="stat-label">조회수</span>
			</div>
			<div class="stat-item">
				<span class="stat-number">{data.stats.totalUsers}</span>
				<span class="stat-label">사용자</span>
			</div>
		</div>
	</header>

	<!-- 검색 및 필터 섹션 -->
	<section class="search-section">
		<div class="search-box">
			<input
				type="text"
				bind:value={searchInput}
				on:keydown={(e) => e.key === 'Enter' && handleSearch()}
				placeholder="게시물 검색..."
				class="search-input"
			/>
			<button on:click={handleSearch} class="search-btn">검색</button>
		</div>

		{#if data.searchQuery || data.category}
			<div class="active-filters">
				{#if data.searchQuery}
					<span class="filter-tag">검색: {data.searchQuery}</span>
				{/if}
				{#if data.category}
					<span class="filter-tag">카테고리: {data.category}</span>
				{/if}
				<button on:click={clearFilters} class="clear-filters">필터 지우기</button>
			</div>
		{/if}
	</section>

	<div class="main-content">
		<!-- 사이드바 -->
		<aside class="sidebar">
			<!-- 날씨 위젯 -->
			<div class="widget weather-widget">
				<h3>🌤️ 오늘의 날씨</h3>
				<div class="weather-info">
					<p><strong>{data.weather.city}</strong></p>
					<p class="temperature">{data.weather.temperature}°C</p>
					<p>{data.weather.condition}</p>
					<div class="weather-details">
						<span>습도: {data.weather.humidity}%</span>
						<span>바람: {data.weather.windSpeed}m/s</span>
					</div>
				</div>
			</div>

			<!-- 카테고리 -->
			<div class="widget categories-widget">
				<h3>📁 카테고리</h3>
				<ul class="categories-list">
					{#each data.categories as category}
						<li>
							<button
								on:click={() => filterByCategory(category.name)}
								class="category-link"
								class:active={data.category === category.name.toLowerCase()}
							>
								{category.name}
								<span class="count">({category.count})</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>

			<!-- 추천 게시물 -->
			<div class="widget featured-widget">
				<h3>⭐ 추천 게시물</h3>
				<ul class="featured-list">
					{#each data.featuredPosts as post}
						<li class="featured-item">
							<h4>{post.title}</h4>
							<p class="featured-meta">
								{post.author} · {post.date}
							</p>
						</li>
					{/each}
				</ul>
			</div>

			<!-- 사용자 정보 (조건부) -->
			{#if data.userData}
				<div class="widget user-widget">
					<h3>👤 사용자 정보</h3>
					<div class="user-info">
						<p><strong>{data.userData.name}</strong></p>
						<p>{data.userData.email}</p>
						<p>가입일: {data.userData.joinDate}</p>
						<p>작성한 글: {data.userData.postCount}개</p>
					</div>
				</div>
			{/if}
		</aside>

		<!-- 메인 콘텐츠 -->
		<main class="content">
			<!-- 게시물 목록 -->
			<section class="posts-section">
				<div class="posts-header">
					<h2>📝 게시물</h2>
					<p class="posts-count">
						{data.totalPosts}개의 게시물이 있습니다
						{#if data.searchQuery}
							(검색: "{data.searchQuery}")
						{/if}
					</p>
				</div>

				{#if data.posts.length > 0}
					<div class="posts-list">
						{#each data.posts as post}
							<article class="post-card">
								<header class="post-header">
									<h3 class="post-title">{post.title}</h3>
									<div class="post-meta">
										<span class="author">✍️ {post.author}</span>
										<span class="date">📅 {post.date}</span>
									</div>
								</header>
								<div class="post-content">
									<p>{post.content}</p>
								</div>
								<footer class="post-footer">
									<div class="tags">
										{#each post.tags as tag}
											<button on:click={() => filterByCategory(tag)} class="tag">
												#{tag}
											</button>
										{/each}
									</div>
								</footer>
							</article>
						{/each}
					</div>

					<!-- 페이지네이션 -->
					{#if data.totalPages > 1}
						<nav class="pagination">
							<button
								on:click={() => goToPage(data.currentPage - 1)}
								disabled={!data.hasPrevPage}
								class="page-btn"
							>
								← 이전
							</button>

							<span class="page-info">
								{data.currentPage} / {data.totalPages}
							</span>

							<button
								on:click={() => goToPage(data.currentPage + 1)}
								disabled={!data.hasNextPage}
								class="page-btn"
							>
								다음 →
							</button>
						</nav>
					{/if}
				{:else}
					<div class="no-posts">
						<p>😅 검색 결과가 없습니다.</p>
						<button on:click={clearFilters} class="clear-filters"> 모든 게시물 보기 </button>
					</div>
				{/if}
			</section>
		</main>
	</div>

	<!-- 푸터 -->
	<footer class="footer">
		<p>
			🕒 마지막 업데이트: {data.stats.lastUpdated}
			| ⚡ 로딩 시간: {Math.round(data.loadTime)}ms
		</p>
		<p>Made with ❤️ using SvelteKit</p>
	</footer>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.header {
		text-align: center;
		margin-bottom: 40px;
		padding: 40px 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 12px;
	}

	.header h1 {
		margin: 0 0 10px 0;
		font-size: 2.5rem;
	}

	.subtitle {
		margin: 0 0 30px 0;
		opacity: 0.9;
		font-size: 1.1rem;
	}

	.stats {
		display: flex;
		justify-content: center;
		gap: 40px;
		margin-top: 20px;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-number {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.stat-label {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.search-section {
		margin-bottom: 30px;
	}

	.search-box {
		display: flex;
		gap: 10px;
		margin-bottom: 15px;
	}

	.search-input {
		flex: 1;
		padding: 12px 16px;
		border: 2px solid #e1e5e9;
		border-radius: 8px;
		font-size: 1rem;
	}

	.search-input:focus {
		outline: none;
		border-color: #667eea;
	}

	.search-btn {
		padding: 12px 24px;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
	}

	.search-btn:hover {
		background: #5a6fd8;
	}

	.active-filters {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.filter-tag {
		background: #f8f9fa;
		padding: 6px 12px;
		border-radius: 20px;
		font-size: 0.9rem;
		border: 1px solid #e1e5e9;
	}

	.clear-filters {
		background: #dc3545;
		color: white;
		border: none;
		padding: 6px 12px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.main-content {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 40px;
		margin-bottom: 40px;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.widget {
		background: white;
		border: 1px solid #e1e5e9;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.widget h3 {
		margin: 0 0 15px 0;
		color: #333;
		font-size: 1.1rem;
	}

	.weather-info {
		text-align: center;
	}

	.temperature {
		font-size: 2rem;
		font-weight: bold;
		color: #667eea;
		margin: 10px 0;
	}

	.weather-details {
		display: flex;
		justify-content: space-between;
		margin-top: 15px;
		font-size: 0.9rem;
		color: #666;
	}

	.categories-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.categories-list li {
		margin-bottom: 8px;
	}

	.category-link {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 8px 12px;
		background: none;
		border: 1px solid #e1e5e9;
		border-radius: 6px;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}

	.category-link:hover,
	.category-link.active {
		background: #f8f9ff;
		border-color: #667eea;
		color: #667eea;
	}

	.count {
		color: #666;
		font-size: 0.9rem;
	}

	.featured-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.featured-item {
		margin-bottom: 15px;
		padding-bottom: 15px;
		border-bottom: 1px solid #f0f0f0;
	}

	.featured-item:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.featured-item h4 {
		margin: 0 0 5px 0;
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.featured-meta {
		margin: 0;
		font-size: 0.8rem;
		color: #666;
	}

	.user-info {
		text-align: center;
	}

	.user-info p {
		margin: 5px 0;
	}

	.content {
		min-height: 500px;
	}

	.posts-header {
		margin-bottom: 30px;
	}

	.posts-header h2 {
		margin: 0 0 10px 0;
		color: #333;
	}

	.posts-count {
		margin: 0;
		color: #666;
		font-size: 0.95rem;
	}

	.posts-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.post-card {
		background: white;
		border: 1px solid #e1e5e9;
		border-radius: 12px;
		padding: 25px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.2s;
	}

	.post-card:hover {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.post-header {
		margin-bottom: 15px;
	}

	.post-title {
		margin: 0 0 10px 0;
		color: #333;
		font-size: 1.3rem;
	}

	.post-meta {
		display: flex;
		gap: 20px;
		font-size: 0.9rem;
		color: #666;
	}

	.post-content {
		margin-bottom: 20px;
		line-height: 1.6;
		color: #555;
	}

	.post-footer {
		border-top: 1px solid #f0f0f0;
		padding-top: 15px;
	}

	.tags {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.tag {
		background: #f8f9ff;
		color: #667eea;
		border: 1px solid #e1e8ff;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.tag:hover {
		background: #667eea;
		color: white;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		margin-top: 40px;
	}

	.page-btn {
		padding: 10px 20px;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.page-btn:hover:not(:disabled) {
		background: #5a6fd8;
	}

	.page-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.page-info {
		font-weight: bold;
		color: #333;
	}

	.no-posts {
		text-align: center;
		padding: 60px 20px;
		color: #666;
	}

	.no-posts p {
		font-size: 1.2rem;
		margin-bottom: 20px;
	}

	.footer {
		text-align: center;
		padding: 30px 0;
		border-top: 1px solid #e1e5e9;
		color: #666;
		font-size: 0.9rem;
	}

	.footer p {
		margin: 5px 0;
	}

	/* 반응형 디자인 */
	@media (max-width: 768px) {
		.main-content {
			grid-template-columns: 1fr;
		}

		.stats {
			gap: 20px;
		}

		.search-box {
			flex-direction: column;
		}

		.post-meta {
			flex-direction: column;
			gap: 5px;
		}
	}
</style>
