(function(){
    $(document).on('mousewheel', function(event) {
        throttle(listenScroll, event);
    });
    var activeId = 0;
    var done = true;
    // 页面滚动事件
    function listenScroll(event) {
        if(done) {
            if(event.deltaY > 0) {
                if(activeId === 0) return;
                activeId--;
            } else {
                if(activeId === 4) return;
                activeId++;
            }
            done = false;
            document.body.className = 'active-' + activeId;
            setTimeout(function() {
                done = true;
            }, 1000);
        }
        
    }

    // 函数节流
    function throttle(method, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function(){
            method(context);
        }, 100);
    }

    $(function(){
       document.body.className = 'active-0';
       $('#media').addClass('show'); 
    });
})(jQuery);