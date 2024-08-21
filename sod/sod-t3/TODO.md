# Maintenance and Debugg utilities
  ## DB
    - docker-compose exec db psql -U berry -d sod-db


# TODO

## General
- Type safety
- refactor where needed
- Check and correct naming of files and folders
  - consistency is the word here
- replace all the denied access code with proper page/component
- gameState seems to be overridden, fix it !

## Landing page
- Need to check the length of the search result, if there is any limit to it
- search results need to be relevant as much as possible

## Player
 - Uncaught AnthemError: onSpotifyWebPlaybackSDKReady is not defined

## Navbar

## History
- rework design
- loading screen not good

## About

## Contact
- make it ssr + loading but component client is imported -> faster


## Footer
- make one


## Feature Ideas
- customised song of the day depending of user's taste
- implement easy mode, where a bit of the song is played
- allow player to choose his genre
- improve picking algo
- use https://www.tremor.so/ for design ?


# Improvments
## implement Redis
  - todo !
## Data mining:
  ### collect ids of attempted selections/guesses
## search input
  - autocomplete ? trigger search as soon as it reaches 1 or 2 chars ?
## Guesses
  - avoid history duplicates, or history all togheter
