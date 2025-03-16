export const config = {
  node: [
    'https://api.steemit.com',
    'https://api.upvu.org',
    'https://api.justyy.com',
    'https://steemd.steemworld.org',
    'https://api.steem.fans',
    'https://api.dlike.io',
    'https://steemapi.boylikegirl.club',
    'https://api.pennsif.net'

  ],
  chain_id: '0000000000000000000000000000000000000000000000000000000000000000',
  address_prefix: 'STM',
  axiosAdapter: null,
  timeout: 5, // 5 seconds
  retry: 5 // consecutive retries on one call
}
