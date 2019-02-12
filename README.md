# Github Avatar Downloader

## Problem Statement

Given a Github repo name and owner, download the avatar image for all contributors and save them (named after their respective owners) in the subdirectory './avatars/'.

## Expected Usage

This program should be executed from the command line, in the following manner:

'node download-avatars.js jquery jquery'

## To Do

- [x] Initialize Git
- [x] Install 'Request' library
- [x] Write a modular function that handles the get request and pipes the required outputs to the desired location, with appropriate labelling