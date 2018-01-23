var intSize = 8;

function authHeight() {
    $("#page-content").css("height", $(window).height() - $("#page-content").offset()["top"] - $(".footer").innerHeight() + "px")
}

function addDiv(strId, strTitle) {
    $windowDiv.find("div.active").removeClass("active");
    if ($windowDiv.find("div:not(div.hide)").size() >= intSize) {
        $windowDiv.find("div:not(div.hide):first").addClass("hide");
        $("#window-prev").removeClass("hide");
    }
    var html = '<div class="me-div active" data-id="' + strId + '"><span>' + strTitle + '</span><a href="javascript:;" class="me-window-close"><i class="ace-icon fa fa-times me-i-close"></i></a></div>';
    $windowDiv.append(html);
}

function addIframe(strId, strUrl, strTitle) {
    strId = "iframe-" + strId;
    $divContent.find("iframe.active").removeClass("active").addClass("hide");
    $windowDiv.find("div.active").removeClass("active");
    if ($divContent.find("#" + strId).size() > 0) {
        $divContent.find("#" + strId).addClass("active").removeClass("hide");
        $windowDiv.find("div[data-id=" + strId + "]").addClass("active");
    } else {
        var strIframe = '<iframe id="' + strId + '" name="' + strId + '" ' + 'width="100%" class="active iframe" height="100%" src="' + strUrl + '" frameborder="0"></iframe>';
        addDiv(strId, $.trim(strTitle));
        $("#page-content").append(strIframe);
    }
}

$(function () {
    $(window).resize(function () {
        authHeight()
    });
    $("#window-refresh").click(function (evt) {
        evt.preventDefault();
        var objActive = $("#page-content iframe.active").get(0);
        if (objActive) {
            objActive.contentWindow.location.reload()
        }
    });
    $(document).on("click", "#me-window span", function () {
        $("#me-window").find("div.active").removeClass("active");
        $("#page-content").find("iframe.active").removeClass("active").addClass("hide");
        $("#" + $(this).parent().addClass("active").attr("data-id")).removeClass("hide").addClass("active")
    });
    $(document).on("click", "a.me-window-close", function (evt) {
        evt.preventDefault();
        var $parent = $(this).parent("div"),
            isHasActive = $parent.hasClass("active"),
            $next = $windowDiv.find("div:not(div.hide):last").next("div");
        if ($next.size() > 0) {
            $next.removeClass("hide");
            if (isHasActive) {
                $divContent.find("#" + $next.addClass("active").attr("data-id")).removeClass("hide").addClass("active")
            }
        } else {
            $windowDiv.find("div:not(div.hide):first").prev("div").removeClass("hide");
            if (isHasActive || $windowDiv.find("div.active").size() <= 0) {
                $divContent.find("#" + $parent.prev("div").addClass("active").removeClass("hide").attr("data-id")).removeClass("hide").addClass("active")
            }
        }

        $parent.remove();
        $("#" + $parent.attr("data-id")).remove();
        var intShowDiv = $windowDiv.find("div:not(div.hide)").size();
        if ($windowDiv.find("div:not(div.hide):last").next("div").size() <= 0 || intShowDiv < intSize) {
            $("#window-next").addClass("hide")
        }

        if ($windowDiv.find("div:not(div.hide):first").prev("div").size() <= 0 || intShowDiv < intSize) {
            $("#window-prev").addClass("hide")
        }
    });
    $("#nav-list-main").find("a").click(function (e) {
        e.preventDefault();
        if ($(this).attr("href") != "#") {
            addIframe($(this).attr("data-id"), $(this).prop("href"), $(this).text());
            var $parent = $(this).closest("li").parent();
            if ($parent.hasClass("nav-list")) {
                $parent.children("li").removeClass("active");
                $parent.find("li.hsub ul.submenu").hide().removeClass("open active").find("li").removeClass("active")
            } else if ($parent.hasClass("submenu")) {
                $parent.find("li.active").removeClass("active");
                $parent.parent("li").siblings("li").removeClass("active")
            }
            $(this).closest("li").addClass("active")
        }
    });
    $("#window-prev").click(function () {
        if ($windowDiv.find("div:not(div.hide):first").prev("div").size() > 0) {
            $windowDiv.find("div:not(div.hide):first").prev("div").removeClass("hide");
            $windowDiv.find("div:not(div.hide):last").addClass("hide");
            $("#window-next").removeClass("hide");
            if ($windowDiv.find("div:not(div.hide):first").prev("div").size() <= 0) {
                $(this).addClass("hide")
            }
        } else {
            if ($windowDiv.find("div.hide").size() > 0) {
                $("#window-next").removeClass("hide")
            }
        }
    });

    $("#window-next").click(function () {
        if ($windowDiv.find("div:not(div.hide):last").next("div").size() >= 1) {
            $windowDiv.find("div:not(div.hide):last").next("div").removeClass("hide");
            $windowDiv.find("div:not(div.hide):first").addClass("hide");
            $("#window-prev").removeClass("hide");
            if ($windowDiv.find("div:not(div.hide):last").next("div").size() <= 0) {
                $(this).addClass("hide")
            }
        } else {
            if ($windowDiv.find("div.hide").size() > 0) {
                $("#window-prev").removeClass("hide")
            }
        }
    });

    $(".window-iframe").click(function (e) {
        e.preventDefault();
        if ($(this).attr("data-id")) {
            addIframe($(this).attr("data-id"), $(this).attr("data-url"), $(this).attr("title"))
        }
    })
});