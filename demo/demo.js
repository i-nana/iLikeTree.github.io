(function () {
    $(document).on('mousewheel', function (event) {
        event.preventDefault();
        throttle(listenScroll, event);
    });
    var ids = ['home', 'my', 'demo', 'daily', 'end'];
    var activeId = 0;
    var len = ids.length;
    var done = true;
    // 页面滚动事件
    function listenScroll(event) {
        if (done) {
            var oldId = -1;
            if (event.deltaY > 0) {
                if (activeId === 0) return;
                oldId = activeId;
                activeId--;
            } else {
                if (activeId === len - 1) return;
                oldId = activeId;
                activeId++;
            }
            done = false;
            $('body').removeClass('active-' + ids[oldId]).addClass('active-' + ids[activeId]);
            $('.sec-' + ids[oldId]).addClass('sec-out').removeClass('sec-in');
            $('.sec-' + ids[activeId]).addClass('sec-in').removeClass('sec-out');
            $('#slidebar li').removeClass('slidebar-active').eq(activeId).addClass('slidebar-active');
            setTimeout(function () {
                done = true;
            }, 1000);
        }

    }

    // 函数节流
    function throttle(method, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function () {
            method(context);
        }, 100);
    }

    $(function () {
        $('body').addClass('active-' + ids[activeId]);
        $('.sec-' + ids[activeId]).addClass('sec-in');
        $('#media').addClass('show');
    });
})(jQuery);