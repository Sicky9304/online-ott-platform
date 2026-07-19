/**
 * fetch_youtube_movies.js
 * Fetches Hindi Dubbed, South Hindi Dubbed, Bhojpuri & Korean Hindi Dubbed
 * full movies from YouTube Data API v3 → saves to JSON files
 *
 * Run: node fetch_youtube_movies.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const API_KEY = 'AIzaSyCcdGrcloredtpqynqRvxNLTCOICi7F-Rc';
const BASE    = 'https://www.googleapis.com/youtube/v3';
const OUT_DIR = path.join(__dirname);

// ─── HTTP Helper ─────────────────────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error('JSON parse error')); }
      });
    })
    .on('timeout', function() { this.destroy(); reject(new Error('Timeout')); })
    .on('error', reject);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── Search YouTube for full movies ─────────────────────────────────────────
async function searchYT(query, maxResults = 50, pageToken = '') {
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    videoDuration: 'long',       // Only long videos (>20 min) = likely full movies
    videoEmbeddable: 'true',     // Must be embeddable in our player
    videoSyndicated: 'true',     // Available outside YouTube
    maxResults: Math.min(maxResults, 50),
    order: 'relevance',
    key: API_KEY,
    ...(pageToken && { pageToken })
  });

  const url = `${BASE}/search?${params}`;
  const data = await fetchJSON(url);

  if (data.error) {
    throw new Error(`YouTube API Error: ${data.error.message}`);
  }

  return data;
}

// ─── Get video details (duration, stats, etc.) ───────────────────────────────
async function getVideoDetails(videoIds) {
  if (!videoIds.length) return [];

  const params = new URLSearchParams({
    part: 'snippet,contentDetails,statistics',
    id: videoIds.join(','),
    key: API_KEY
  });

  const data = await fetchJSON(`${BASE}/videos?${params}`);
  return data.items || [];
}

// ─── Parse ISO 8601 duration → minutes ──────────────────────────────────────
function parseDuration(iso) {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] || 0);
  const m = parseInt(match[2] || 0);
  const s = parseInt(match[3] || 0);
  return h * 60 + m + Math.round(s / 60);
}

// ─── Format a YouTube item into our movie schema ─────────────────────────────
function formatVideo(item, detail, category, language) {
  const snippet  = item.snippet || {};
  const dSnippet = detail?.snippet || snippet;
  const stats    = detail?.statistics || {};
  const duration = parseDuration(detail?.contentDetails?.duration);
  const videoId  = item.id?.videoId || item.id;
  const pubDate  = dSnippet.publishedAt || '';
  const year     = pubDate ? parseInt(pubDate.substring(0, 4)) : null;

  const title = dSnippet.title || 'Untitled';
  const desc  = (dSnippet.description || '').substring(0, 500);

  // Get best thumbnail
  const thumbs = dSnippet.thumbnails || {};
  const thumbnail =
    thumbs.maxres?.url ||
    thumbs.high?.url  ||
    thumbs.medium?.url ||
    thumbs.default?.url || null;

  return {
    youtubeId: videoId,
    source: 'youtube',
    category,
    language,
    title,
    description: desc || `${title} — Free full movie on YouTube.`,
    releaseYear: year,
    duration,                              // in minutes
    channelTitle: dSnippet.channelTitle || '',
    channelId: dSnippet.channelId || '',
    publishedAt: pubDate,
    genres: detectGenres(title + ' ' + desc),
    thumbnailUrl: thumbnail,
    posterUrl: thumbnail,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    viewCount: parseInt(stats.viewCount || 0),
    likeCount: parseInt(stats.likeCount || 0),
    isFree: true,
    isEmbeddable: true
  };
}

function detectGenres(text) {
  const t = text.toLowerCase();
  const map = [
    ['action'],['comedy'],['drama'],['romance'],['thriller'],['horror'],
    ['crime'],['adventure'],['mystery'],['family'],['fantasy'],
    ['science fiction'],['war'],['biography'],['historical'],['musical'],
    ['south indian'],['bollywood'],['bhojpuri'],['korean'],['dubbed']
  ];
  return map.filter(([g]) => t.includes(g)).map(([g]) => g.charAt(0).toUpperCase() + g.slice(1)).slice(0, 4);
}

// ─── Main search function ─────────────────────────────────────────────────────
async function fetchCategory(label, queries, language, targetCount = 100) {
  console.log(`\n  🔍 [${label}]`);
  const allItems = [];
  const seenIds  = new Set();

  for (const query of queries) {
    if (allItems.length >= targetCount) break;

    try {
      console.log(`     Searching: "${query}"`);
      const data = await searchYT(query, 50);
      const items = data.items || [];

      for (const item of items) {
        const vid = item.id?.videoId;
        if (!vid || seenIds.has(vid)) continue;
        seenIds.add(vid);
        allItems.push(item);
      }

      // Get next page if needed
      if (allItems.length < targetCount && data.nextPageToken) {
        await sleep(500);
        const page2 = await searchYT(query, 50, data.nextPageToken);
        for (const item of page2.items || []) {
          const vid = item.id?.videoId;
          if (!vid || seenIds.has(vid)) continue;
          seenIds.add(vid);
          allItems.push(item);
        }
      }

      console.log(`     ✅ ${items.length} results (total so far: ${allItems.length})`);
      await sleep(300); // rate limit

    } catch (err) {
      console.log(`     ❌ Error: ${err.message}`);
    }
  }

  // Enrich with video details (duration, stats) in batches of 50
  console.log(`     🎞️  Fetching video details for ${allItems.length} videos...`);
  const detailMap = {};
  const batchSize = 50;

  for (let i = 0; i < allItems.length; i += batchSize) {
    const batch = allItems.slice(i, i + batchSize);
    const ids   = batch.map(v => v.id?.videoId).filter(Boolean);
    try {
      const details = await getVideoDetails(ids);
      details.forEach(d => { detailMap[d.id] = d; });
      await sleep(300);
    } catch (err) {
      console.log(`     ⚠️  Detail fetch error: ${err.message}`);
    }
  }

  // Format all videos
  const movies = allItems.map(item => {
    const vid = item.id?.videoId;
    return formatVideo(item, detailMap[vid] || null, label, language);
  });

  // Filter: must be > 40 mins (real movie, not clip)
  const longMovies = movies.filter(m => m.duration === 0 || m.duration >= 40);

  console.log(`     📊 ${movies.length} total, ${longMovies.length} are full-length (>40 min)`);
  return longMovies;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n=======================================================');
  console.log('🎬  YOUTUBE MOVIE FETCHER');
  console.log('    Hindi Dubbed | South Dubbed | Bhojpuri | Korean Dubbed');
  console.log('=======================================================');

  const categories = [

    // ── HINDI DUBBED (General) ────────────────────────────────────────────
    {
      label: 'Hindi Dubbed Movies',
      language: 'Hindi Dubbed',
      queries: [
        'full hindi dubbed movie 2024',
        'full hindi dubbed movie 2023',
        'full movie hindi dubbed action',
        'full movie hindi dubbed comedy',
        'full movie hindi dubbed thriller',
        'new hindi dubbed movie 2024 full',
      ]
    },

    // ── SOUTH INDIAN HINDI DUBBED ─────────────────────────────────────────
    {
      label: 'South Hindi Dubbed',
      language: 'Hindi Dubbed (South)',
      queries: [
        'south indian hindi dubbed full movie 2024',
        'south indian hindi dubbed full movie 2023',
        'telugu hindi dubbed full movie 2024',
        'tamil hindi dubbed full movie 2024',
        'malayalam hindi dubbed full movie 2024',
        'kannada hindi dubbed full movie 2024',
        'new south movie hindi dubbed 2024 full',
        'south action full movie hindi dubbed',
        'tollywood hindi dubbed full movie',
      ]
    },

    // ── BHOJPURI ─────────────────────────────────────────────────────────
    {
      label: 'Bhojpuri Movies',
      language: 'Bhojpuri',
      queries: [
        'bhojpuri full movie 2024',
        'bhojpuri full movie 2023',
        'bhojpuri action full movie',
        'bhojpuri comedy full movie',
        'new bhojpuri movie 2024',
        'bhojpuri full film HD',
      ]
    },

    // ── KOREAN HINDI DUBBED ───────────────────────────────────────────────
    {
      label: 'Korean Hindi Dubbed',
      language: 'Hindi Dubbed (Korean)',
      queries: [
        'korean movie hindi dubbed full movie',
        'korean action movie hindi dubbed full',
        'korean drama hindi dubbed full movie',
        'korean hindi dubbed 2024 full movie',
        'korean thriller hindi dubbed full movie',
        'korean romantic movie hindi dubbed full',
      ]
    },

  ];

  const resultsByCategory = {};
  const allMovies = [];

  for (const cat of categories) {
    try {
      const movies = await fetchCategory(cat.label, cat.queries, cat.language, 150);
      resultsByCategory[cat.label] = movies;
      allMovies.push(...movies);
    } catch (err) {
      console.log(`\n  ❌ Category failed: ${cat.label} — ${err.message}`);
      if (err.message.includes('quota')) {
        console.log('  ⛔ YouTube API quota exceeded! Try again tomorrow.');
        break;
      }
    }
  }

  // ── DEDUP across categories ──
  const seen = new Set();
  const deduped = allMovies.filter(m => {
    if (seen.has(m.youtubeId)) return false;
    seen.add(m.youtubeId);
    return true;
  });

  // ── STATS ────────────────────────────────────────────────────────────────
  console.log('\n\n📊 FINAL RESULTS:');
  for (const [cat, movies] of Object.entries(resultsByCategory)) {
    console.log(`   ${cat.padEnd(30)}: ${movies.length} movies`);
  }
  console.log(`   ${'TOTAL (deduped)'.padEnd(30)}: ${deduped.length} movies`);

  // ── SAVE FILES ───────────────────────────────────────────────────────────
  console.log('\n💾 Saving JSON files...');

  // Per-category files
  const fileMap = {
    'yt_hindi_dubbed.json':          resultsByCategory['Hindi Dubbed Movies']       || [],
    'yt_south_hindi_dubbed.json':    resultsByCategory['South Hindi Dubbed']        || [],
    'yt_bhojpuri.json':              resultsByCategory['Bhojpuri Movies']           || [],
    'yt_korean_hindi_dubbed.json':   resultsByCategory['Korean Hindi Dubbed']       || [],
    'yt_all_movies.json':            deduped,
  };

  for (const [file, data] of Object.entries(fileMap)) {
    fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(data, null, 2), 'utf8');
    console.log(`   ✅ ${file.padEnd(35)} — ${data.length} movies`);
  }

  // Summary
  const summary = {
    generatedAt: new Date().toISOString(),
    apiSource: 'YouTube Data API v3',
    total: deduped.length,
    byCategory: Object.fromEntries(
      Object.entries(resultsByCategory).map(([k, v]) => [k, v.length])
    ),
    note: 'All movies fetched are publicly available on YouTube. Duration filter: >40 minutes.'
  };
  fs.writeFileSync(path.join(OUT_DIR, 'yt_summary.json'), JSON.stringify(summary, null, 2), 'utf8');
  console.log(`   ✅ yt_summary.json`);

  console.log('\n🎉 ALL DONE!\n');
}

main().catch(err => {
  console.error('\n❌ Fatal:', err.message);
  process.exit(1);
});
