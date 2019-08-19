# What's this?

The center of this project is to bring the [manim](http://github.com/3b1b/manim/) library (core) to the web, and to use it to create a nice set of animations to explain math (and other contents) visually.

This library is written using the latest features of JavaScript and is currently not supported for most of the browser, but that's not a big deal for now.

## First step

Take a quick look to `manim-js` in action [here](https://isaacvr.github.io/manim-js/).

Notice that this is a project that's starting recently, so don't be sad if is here only the core of `manim`, but that will change in the future.

## Setup

First, download the code or clone it:

```bash
> git clone https://github.com/isaacvr/manim-js.git
> cd manim-js
```

To set things up, you need to install the following dependencies:

```bash
> npm run install-deps
```

## Building the stuff

```bash
> npm run build
```

now in the `/dist` folder you will have the file `animator.js` that you can include in your code and have fun with it.

## Using it in developer-mode

In the root directory of the project, type:

```bash
> node watcher
```

That's a very simple program who detects changes and rebuild them.

Then, run a server in the same path:

```bash
> python -m SimpleHTTPServer 8080
```

or

```bash
> http-server -p 8080
```

or any other.

Open the browser at [localhost](http://localhost:8080/)

and see the results.

## Contributing

You are free to send a Pull Request with some features and if is the first time, there will be kind of a test to see if you really understood the project's code.

Also, you can directly contact me through my [Telegram](https://t.me/isaacvr) account
