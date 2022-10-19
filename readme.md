
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

h.router('one'); // create router named 'one'
h.router('two'); // create router named 'two'
```

> at the moment you pass in a name
> to the router as a string to make things easier
> to debug. this might change.

### handlers

now we can add _handlers_ to each router.

a handler is a set of rules which react
to _packets_ coming in.

```js
let handler = {
    source: null,
    message: 'hello',
    fn: () => console.log('got hello')
}
```

a handler is just an object with particular
fields - `source`, `message`, etc.

what this handler is saying is:

- if we get a packet from any source (`null` means not-specified)
  with message `hello`, run said function.

