# bookie
A feature-rich Telegram bot that crawls free book websites and searches across multiple other sources to provide users with free books on demand.
## Description
bookie is a simple, yet feature-rich Telegram bot that uses modern anti-block mechanisms to search for and download books from different sources across the web.
> [!NOTE]
> This is an **initial** but functional code version of bookie. More updates are coming to it from its developer and the expected community to widen the range of [Supported Sites](#supported-sites-anchor).

## Features
- TLS-fingerprinting & stealthy browsing thanks to [Crawlee](https://github.com/apify/crawlee)
- Scalable code base with types
- Pre-configured clients

## Usage
1. Install the dependencies using `npm install`
2. Fill in your bot's API token & your MongoDB connection string in the .env file
3. Start the bot with `npm start`
<a name="supported-sites-anchor"></a>
## Supported sites
- [Noor Library](https://www.noor-book.com/)
- Telegram channels __(Soon)__

## Legal Disclaimer
- bookie agrees to the user policies established by the [Supported Sites](#supported-sites-anchor), which prohibit their use for commercial purposes.
- bookie does not endorse or support any of the materials/books or their creators; its primary purpose is to provide free resources under the protection of Article 27 of the [Universal Declaration of Human Rights](https://www.un.org/ar/about-us/universal-declaration-of-human-rights), which states that everyone has the right to freely participate in the cultural life of the community.
- The [Electronic Frontier Foundation (EFF)](https://eff.org/) states that providing a tool for the public to copy electronic materials does not create legal liability for copyright infringement.
