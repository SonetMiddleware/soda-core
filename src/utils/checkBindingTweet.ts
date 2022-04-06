let hasBinding = false;
const checkBinding = async (contentId: string) => {
  try {
    const idArrs = contentId.split('/');
    const id = idArrs[idArrs.length - 1];
    const variables = {
      focalTweetId: id,
      with_rux_injections: false,
      includePromotedContent: true,
      withCommunity: true,
      withTweetQuoteCount: true,
      withBirdwatchNotes: false,
      withSuperFollowsUserFields: true,
      withUserResults: true,
      withBirdwatchPivots: false,
      withReactionsMetadata: false,
      withReactionsPerspective: false,
      withSuperFollowsTweetFields: true,
      withVoice: true,
    };
    const intId = setInterval(async () => {
      const tt = localStorage.getItem('requestHeaders');
      console.log('get items.requestHeaders: ', tt);
      if (tt && tt.indexOf('x-csrf-token') > -1) {
        clearInterval(intId);
        const res1 = await fetch(
          'https://twitter.com/i/api/graphql/4tzuTRu5-fpJTS7bDF6Nlg/TweetDetail?variables=' +
            encodeURIComponent(JSON.stringify(variables)),
          {
            method: 'GET',
            headers: JSON.parse(tt),
          },
        );
        console.log('bindres1: ', res1);
        const result1 = await res1.json();

        console.log('bindres11: ', result1);
        //  No status found with that ID."
        if (
          result1.errors &&
          result1.errors[0] &&
          result1.errors[0].code === 144
        ) {
        }
      }
    }, 500);
  } catch (err) {
    console.log(err);
    hasBinding = false;
  }
};

export default checkBinding;
