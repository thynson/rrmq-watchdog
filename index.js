const {RedisQueueWatchdog} = require('rrmq');
const program = require('commander');

program
.version('0.1.0')
.option('-s, --watchdog-redis-host [host]', 'Host of redis which this watchdog subscribe to')
.option('-p, --watchdog-redis-port [port]', 'Port of redis which this watchdog subscribe to', parseInt)
.option('-S, --redis-host [host]', 'Host of redis which message is queued')
.option('-P, --redis-port [port]', 'Port of redis which message is queued', parseInt)
.option('-t, --watchdog-timed-out [timeout]', 'Timeout of watchdog', parseInt)
.option('-w, --watchdog-topic [topic]', 'Watchdog topic')
.parse(process.argv);

if (program.watchdogTopic == null) {
    console.log(program.helpInformation());
    process.exit(0);
}

const watchdog = new RedisQueueWatchdog ({
    watchdogTopic: program.watchdogTopic,
    watchdogTimeout: program.watchdogTimeout,
    watchdogRedisHost: program.watchdogRedisHost,
    watchdogRedisPort: program.watchdogRedisPort,
    redisHost: program.redisHost,
    redisPort: program.redisPort
});

watchdog.on('error', (e)=> {
    console.error(e);
    process.exit();
});
watchdog.start()
.then(()=> {
        console.log(`Watchdog is started on ${program.watchdogRedisHost}:${program.watchdogRedisPort}/${program.watchdogTopic}`);
        console.log(`Watching message queues on ${program.redisHost}:${program.redisPort}`)
});
