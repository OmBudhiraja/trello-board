# Trello Board

Live Link - [https://trello-board-one.vercel.app](https://trello-board-one.vercel.app) 

### Local Setup

```bash
# Clone the repository
git clone https://github.com/ombudhiraja/trello-board.git

# setup server
cd server
mv .env.example .env // update the .env file with your mongodb url
pnpm install
pnpm dev

# setup client
cd client
mv .env.example .env
pnpm install
pnpm dev
```