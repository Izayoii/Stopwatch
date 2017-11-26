function Stopwatch(selector) {

    var main_element = document.querySelector(selector);

    var is_running = false;

    var watch = null;

    var counter = {
        main: {
            element: main_element.querySelector(".main-counter")
        },

        sub: {
            element: null
        }
    };

    var laps = {

        count: 0, 

        element: main_element.querySelector('.laps'), 

        slowest: { 
            value: {},
            update: false,
            element: null
        },

        fastest: {
            value: {},
            update: false,
            element: null
        }
    };

    var buttons = {
        lap: main_element.querySelector('.btn-lap'),
        reset: main_element.querySelector('.btn-reset'),
        start: main_element.querySelector('.btn-start'),
        stop: main_element.querySelector('.btn-stop'),

        showHide: function() {

            this.lap[(watch === null ? 'set' : 'remove') + 'Attribute']('disabled', 'disabled');

            this.lap.style.display = is_running || watch === null ? 'inline' : 'none';

            this.reset.style.display = !is_running && watch !== null ? 'inline' : 'none';

            this.start.style.display = !is_running ? 'inline' : 'none';

            this.stop.style.display = is_running ? 'inline' : 'none';
        }
    };

    // Add click events to their functions
    buttons.lap.onclick = lap;
    buttons.reset.onclick = reset;
    buttons.start.onclick = start;
    buttons.stop.onclick = stop;

    init();
    buttons.showHide();

    function init(item) {

        item = item || 'main';

        counter[item].time = {
            minutes: 0,
            seconds: 0,
            milli_seconds: 0
        };

        counter[item].ticks = 0;

        update();

    }

    function lap() {

        if (laps.count === 1 || counter.sub.ticks > laps.slowest.value.ticks) {

            laps.slowest.value = {
                number: laps.count,
                ticks: counter.sub.ticks
            };

            laps.slowest.update = true;

        }
        if (laps.count === 1 || counter.sub.ticks < laps.fastest.value.ticks) {

            laps.fastest.value = {
                number: laps.count,
                ticks: counter.sub.ticks
            };

            laps.fastest.update = true;
        }

        if (laps.count > 1) {

            if (laps.slowest.update || laps.count === 2) {

                if (laps.slowest.element) {
                    laps.slowest.element.classList.remove('slowest');
                }

                laps.slowest.element = main_element.querySelector('.lap' + laps.slowest.value.number);

                laps.slowest.element.classList.add('slowest');
            }

            if (laps.fastest.update || laps.count === 2) {

                if (laps.fastest.element) {
                    laps.fastest.element.classList.remove('fastest');
                }
                
                laps.fastest.element = main_element.querySelector('.lap' + laps.fastest.value.number);

                laps.fastest.element.classList.add('fastest');
            }
        }

        laps.count++;

        var content = '<div class="lap lap' + laps.count + '">' + '<div class="name pull-left">' + 'Lap ' + laps.count + '</div>' + '<div class="counter pull-right"></div>' + '<div class="clear"></div>' + '</div>';

        laps.element.insertAdjacentHTML('afterbegin', content);

        counter.sub.element = main_element.querySelector('.lap' + laps.count + ' .counter');

        init('sub');
    }

    function reset() {
        laps.count = 0;
        laps.element.innerHTML = '';

        init();

        init('sub');

        watch = null;

        buttons.showHide();
    }

    function start() {

        if (laps.count === 0) {
            lap();
        }

        stop();

        is_running = true;

        watch = setInterval(function() {

            [counter.main, counter.sub].forEach(function(item) {

                item.ticks++;

                if (item.time.milli_seconds == 99) {

                    item.time.milli_seconds = 0;

                    if (item.time.seconds == 59) {

                        item.time.seconds = 0;
                        item.time.minutes++;

                    } else {
                        item.time.seconds++;
                    }
                } else {
                    item.time.milli_seconds++;
                }


            });

            update();

        }, 10);

        buttons.showHide();

    }

    function stop() {

        is_running = false;

        if (watch) {
            clearInterval(watch);
        }
        buttons.showHide();
    }

    function update() {
        [counter.main, counter.sub].forEach(function(item) {
            if (!item.element) {
                return false;
            }
            item.element.innerHTML = format(item.time.minutes) + ':' + format(item.time.seconds) + '.' + format(item.time.milli_seconds);
        });
    }

    function format(digit) {
        if (digit < 10) {
            return '0' + digit;
        }
        return digit;
    }

}
