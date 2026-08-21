//pulls the 11 character youtube video id
//match returns array like object or null, match[0] is the entire string, match[1] is the capture group in parenthesis

export default function extractVideoId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
