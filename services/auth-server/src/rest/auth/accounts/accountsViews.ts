import moment from 'moment';

export function mamsView(videoAsset): object {
  return {
    id: videoAsset.id,
    name: videoAsset.name,
    url: videoAsset.url,
    alternative_url: videoAsset.alternativeUrl,
    mp4_url: videoAsset.mp4Url,
    preview_url: videoAsset.previewUrl,
    // Fields returned from original v3 endpoint filled in below in case they are accessed by 3rd party
    type: 'titan_links',
    square_url: null,
    vertical_url: null,
    timestamp: moment(videoAsset.created_at).format('YYYY-MM-DD HH:MM:s'),
    updated_at: videoAsset.updated_at,
    created_at: videoAsset.created_at,
    region_name: null,
    story_id: null,
  };
}
