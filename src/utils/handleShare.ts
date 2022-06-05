export const isTwitterApp = window.location.href.includes('twitter')
export const isFacebookApp = window.location.href.includes('facebook')

export const pasteTextToPostEditor = async (text: string) => {}

export const newPostTrigger = () => {
  //TODO update for different language
  if (isFacebookApp) {
    const div =
      document.querySelector('[aria-label="创建帖子"]') ||
      document.querySelector('[aria-label="Create a post"]') ||
      document.querySelector('[data-pagelet="ProfileComposer"]')
    if (div) {
      div.querySelector('span')!.click()
    } else {
      const div = document.querySelector(
        'a[aria-label][role="link"] img[height="40"]'
      ).parentElement.parentElement.nextSibling
      if (div) {
        //@ts-ignore
        div.click()
      }
    }
  } else if (isTwitterApp) {
    const newTweetBtn: HTMLElement = document.querySelector(
      '[data-testid="SideNav_NewTweet_Button"]'
    )!
    newTweetBtn.click()
  }
}
