
# router

this is an experiment to see if
i can develop a way
to route processes both locally
and across networks
using a simple standard ...

## basic idea

### hub and routers

you start by creating a `hub`
to which you add some
`router`s to.

```js
import { hub } from '@kewp/router';

let h = hub(); // create new hub

h.router('cat'); // create router named 'cat'
h.router('dog'); // create router named 'dog'
```

> at the moment you pass in a name
> to the router as a string to make things easier
> to debug. this might change.

### sending packets

you can send a _packet_ to one of the routers
with the `send` command

```js
// send packet {message:'ping'}
// from router 'cat' to router 'dog'
h.send('cat', 'dog', {message:'ping'})
```

if you run this now you'll see a warning message

```
warning: no handler for packet from [cat] to [dog] with message 'ping'
```

this is because we haven't set up handlers on `dog`.

### handlers

a handler is a set of rules which react
to a packet coming in.

```js
let handler = {
    source: null,
    message: 'ping',
    fn: (source,message,id) => {
        console.log(`[dog] got message '${message}' with id ${id} from [${source}]`);
        send('dog',source,{ message: 'pong', id });
    }
}
```

it's just an object with particular
fields - `source`, `message`, etc.
what this handler is saying is:

- if we get a packet from any source (`null` means not-specified)
  with message `hello`, run said function.

handlers can send packets as well. `fn` logs
the ping out and sends `pong` back to the
source.

### packet ids

unless specified, each packet has a random id attached to it
when it is sent out. this is so that packets coming back
in response can be matched.

here we send `ping` to `dog` and wait for a `pong` to come
back (which the hub does using the id):

```js
hub.send('dog', 'cat', {message:'ping'}, [
    {
        // watch for message 'pong' in reply (i.e. with same id)
        message: 'pong',
        fn: (source,message,id) => console.log(`[dog] got message '${message}' with id ${id} from [${source}]`),
    }
]);
```

> it's important to understand why we need to match with ids.
> the communication happening here is ... asynchronous?
> for any packet arriving anywhere we do not know what it
> means - is it a reply? a request for something?
> the id tells us 'this is a reply to another message'...

### timeouts

### tutorial

everything covered thus far is in `tutorial.js`
which you can just run to see the output

```
> node tutorial.js
[]
```
