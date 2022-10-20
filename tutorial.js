
let { create_hub } = require('./router.js');

let hub = create_hub();

let { router, handler, send } = hub;

router('a');
router('b');

handler('a', {
    source: 'a',
    fn: (source, message, id) => console.log(`[a] got message '${message}' with id ${id} from self`)
})

handler('b', {
    source: null, // any source
    message: 'ping',
    fn: (source,message,id) => {
        console.log(`[b] got message '${message}' with id ${id} from [${source}]`);
        send('b',source,{ message: 'pong', id });
        // send('b',source,{ message: 'peng', id });
    }
});

handler('b', {
    source: null,
    message: 'long_process_start',
    fn: (source,message,id) => {
        console.log(`[b] got message '${message}' with id ${id} from [${source}]`);
        setTimeout(() => {
            send('b',source,{ message: 'long_process_done', id });
        }, 1000);
    }
});

send('a', 'b', {message:'ping'}, [
    {
        // watch for message 'pong' in reply (i.e. with same id)
        message: 'pong',
        fn: (source,message,id) => console.log(`[a] got message '${message}' with id ${id} from [${source}]`),
        timeout: {
            ms: 500,
            fn: (source,message,id) => console.log(`[a] timeout waiting for message '${message}' with id ${id} from [${source}]`)
        }
    }
]);

send('a',null,{message:'blerg'});

send('a','b', {message:'long_process_start'}, [
    {
        message: 'long_process_end',
        fn: (source,message,id) => console.log(`[a] got message '${message}' with id ${id} from [${source}]`),
        timeout: {
            ms: 500,
            fn: (source,message,id) => console.log(`[a] timeout waiting for message '${message}' with id ${id} from [${source}]`)
        }
    }
]);

