var SiteJS = (function ($) {
    return {
     
       

        openSidebar : function(){
           $('.main-sidebar').toggleClass('open');
           $('.content-wrapper').toggleClass('ml-260');
        }

        
       
    }
})(jQuery);