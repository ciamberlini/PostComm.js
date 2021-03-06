(function() {

    module('Comm finding', {
        setup: function() {
        },
        teardown: function() {
        }
    });

    asyncTest('Valid comm findable among registered', 2, function() {
        var iframe1 = createIframe('SearchedFor1', sameDomainEchoPath);
        var iframe2 = createIframe('SearchedFor2', sameDomainEchoPath);
        var loadCount = 0;

        function iframeLoaded() {
            loadCount += 1;

            if (loadCount < 2)
            {
                return;
            }

            clearTimeout(timeoutId);

            var comm1 = postComm.createIframeComm(iframe1, function() {});
            var comm2 = postComm.createIframeComm(iframe2, function() {});

            equal(postComm.findComm(comm2.getOrigin(), comm2.getContentWindow()), comm2, 'Found second comm');
            equal(postComm.findComm(comm1.getOrigin(), comm1.getContentWindow()), comm1, 'Found first comm');

            start();

            comm1.destroy();
            comm2.destroy();
        }

        $(iframe1).load(function() {
            iframeLoaded();
        });

        $(iframe2).load(function() {
            iframeLoaded();
        });

        var timeoutId = setTimeout(function() {
            ok(false, 'Bailed out of valid comm finding test, iframe(s) did not load');
            ok(false, 'Ignore this failure (ensures qunit consistency)');
            start();
        }, 1000);
    });

    asyncTest('Destroyed comm not findable among registered', 6, function() {
        var iframe1 = createIframe('SearchedFor1', sameDomainEchoPath);
        var iframe2 = createIframe('SearchedFor2', sameDomainEchoPath);
        var loadCount = 0;

        function iframeLoaded() {
            loadCount += 1;

            if (loadCount < 2)
            {
                return;
            }

            clearTimeout(timeoutId);

            var comm1 = postComm.createIframeComm(iframe1, function() {});
            var comm2 = postComm.createIframeComm(iframe2, function() {});

            equal(postComm.findComm(comm2.getOrigin(), comm2.getContentWindow()), comm2, 'Found second comm');
            equal(postComm.findComm(comm1.getOrigin(), comm1.getContentWindow()), comm1, 'Found first comm');

            comm1.destroy();

            equal(postComm.findComm(comm2.getOrigin(), comm2.getContentWindow()), comm2, 'Found second comm after first comm destroyed');
            equal(postComm.findComm(comm1.getOrigin(), comm1.getContentWindow()), undefined, 'Did not find first comm after first comm destroyed');

            comm2.destroy();

            equal(postComm.findComm(comm2.getOrigin(), comm2.getContentWindow()), undefined, 'Did not find second comm after first and second comm destroyed');
            equal(postComm.findComm(comm1.getOrigin(), comm1.getContentWindow()), undefined, 'Did not find first comm after first and second comm destroyed');

            start();        
        }

        $(iframe1).load(function() {
            iframeLoaded();
        });

        $(iframe2).load(function() {
            iframeLoaded();
        });

        var timeoutId = setTimeout(function() {
            ok(false, 'Bailed out of destroyed comm finding test, iframe(s) did not load');
            ok(false, 'Ignore this failure (ensures qunit consistency)');
            ok(false, 'Ignore this failure (ensures qunit consistency)');
            ok(false, 'Ignore this failure (ensures qunit consistency)');
            ok(false, 'Ignore this failure (ensures qunit consistency)');
            ok(false, 'Ignore this failure (ensures qunit consistency)');
            start();
        }, 1000);
    });

    asyncTest('Invalid comm not findable among registered', 1, function() {
        var iframe = createIframe('NotSearchedFor', sameDomainEchoPath);

        $(iframe).load(function() {
            clearTimeout(timeoutId);

            var comm1 = postComm.createIframeComm(iframe, function() {});
            var comm2 = postComm.createComm('http://google.com/', null, function() {});

            equal(postComm.findComm(comm2.getOrigin(), comm2.getContentWindow()), undefined, 'Did not find invalid comm, as expected');

            start();

            comm1.destroy();
            comm2.destroy();
        });

        var timeoutId = setTimeout(function() {
            ok(false, 'Bailed out of finding invalid comm test, iframe(s) did not load');
            start();
        }, 1000);
    });

}());