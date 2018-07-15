var api_read = "";

function onLoadHandler() {
    testingAPI();
    setTimeout(fillData, 500);
    ratingHandler();
    dropDownHandler();
}

function ratingHandler() {
    $('.ui.rating')
        .rating({
            initialRating: 0,
            maxRating: 5
        })
    ;
}

function dropDownHandler() {
    $('.ui.sidebar').sidebar({
        context: $('.ui.pushable.segment'),
        transition: 'overlay'
    }).sidebar('attach events', '#mobile_item');
}

function alertMessageHandler() {

    $('.message .close')
        .on('click', function () {
                $(this)
                    .closest('.message')
                    .transition('fade')
                ;
            }
        )
    ;

    setTimeout(function () {
        document.getElementById("alert-close--button").click();

    }, 7500);

}

function testingAPI() {
    var key = 'NcCaHwHfus5pXDcJlZT73bq53MKC9AGw4DUjCwdW51hXlSIDxNDB38B4QZuOnoCA';
    var url = "https://study.icerik.com/v1/q/contentdetail";
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': key

        },
        success: function (response) {
            console.log(response);
            api_read = response;
        },
        error: function (response) {
            api_read = response;
        }
    });


}

function fillData() {

    let d = new Date(api_read["created_at"] * 1000);

    let dformat = [d.getMonth() + 1,
            d.getDate(),
            d.getFullYear()].join('/') + ' ' +
        [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');


    let visual = "", keywords,
        keywords_content = "<span>Kelime Sayısı:0</span><br>" + "<span>Anahtar Kelime Kullanımı</span>";
    keywords = api_read["content_keywords"].split(",");

    if (api_read["visual"] === true)
        visual = "kullanılacak";
    else
        visual = "Kullanılmayacak";


    document.getElementById("check-time--header").innerHTML = api_read["status_str"];
    document.getElementById("first-path").innerHTML = api_read["project_title"];
    document.getElementById("second-path").innerHTML = api_read["content_title"];
    document.getElementById("content-title").innerHTML = api_read["content_title"];
    document.getElementById("content-dead--time").innerHTML = "Teslim Zamanı: " + dformat;
    document.getElementById("table-body--th").innerHTML = "<td>" + api_read['product_title'] + "</td>"
        + "<td>" + api_read['interest_title'] + "</td>"
        + "<td>" + api_read['userlevel_title'] + "</td>"
        + "<td>" + api_read['language_title'] + "</td>"
        + "<td>" + visual + "</td>"
        + "<td>" + api_read["limit_word_lower"] + "-" + api_read["limit_word_upper"] + "</td>"
        + "<td> <i class=\"lira sign icon\"></i>" + api_read["price_publisher"] + "</td>";
    document.getElementById("content-description").innerHTML = "<div class='description'>İçerik Açıklaması:</div>" + api_read["content_description"];
    document.getElementById("content").innerHTML = "<div class='content'>Yazarın Ürettiği İçerik</div>" + api_read["content"];

    for (let i = 0; i < keywords.length; i++)
        keywords_content += "<div class='ui label'>" + keywords[i] + "</div>";

    document.getElementById("keywords-content").innerHTML = keywords_content;


}

function getRating() {
    return $('.ui.rating')
        .rating('get rating')
        ;
}

function createSuccessMessageAlert(response) {
    let txt =
        '  <div class="ui positive message" id="cancel">' +
        '            <i class="close icon" id="alert-close--button"></i>' +
        '            <div class="header">' +
        response.message +
        '            </div>' +
        '            <p>Bu uyarı 7 saniye sonra kendiliğinden kapanacaktır. Dilerseniz öncesinde kapatabilirsiniz.</p>' +
        '        </div>';


    document.getElementById("alert-positive--message").innerHTML = txt;
}

function createErrorMessageAlert(response) {

    let txt =
        '  <div class="ui negative message">' +
        '            <i class="close icon" id="alert-close--button"></i>' +
        '            <div class="header">' +
        response['responseJSON'].message +
        '            </div>' +
        '            <p>Bu uyarı 7 saniye sonra kendiliğinden kapanacaktır. Dilerseniz öncesinde kapatabilirsiniz.</p>' +
        '        </div>';


    document.getElementById("alert-negative--message").innerHTML = txt;

}

function approvePostRequest(rate) {

    var key = 'NcCaHwHfus5pXDcJlZT73bq53MKC9AGw4DUjCwdW51hXlSIDxNDB38B4QZuOnoCA';
    var url = "https://study.icerik.com/v1/q/approvecontent";

    $.ajax({
        type: 'POST',
        url: url,
        headers: {
            'Api-Key': key

        },
        data: JSON.stringify({
            "id": api_read["id"],
            "score": rate,
        }),
        success: function (response) {
            createSuccessMessageAlert(response);
            alertMessageHandler();

        },
        error: function (response) {
            createErrorMessageAlert(response);
            alertMessageHandler();

        },
        dataType: "json",
        contentType: "application/json"
    });

}

function approve() {
    let rate = getRating();

    if (rate === 0)
        alert("Lütfen içeriği onaylamadan önce puan veriniz...");
    else
        approvePostRequest(rate);

}

function revizePostRequest() {
    var key = 'NcCaHwHfus5pXDcJlZT73bq53MKC9AGw4DUjCwdW51hXlSIDxNDB38B4QZuOnoCA';
    var url = "https://study.icerik.com/v1/q/revisioncontent";

    $.ajax({
        type: 'POST',
        url: url,
        headers: {
            'Api-Key': key

        },
        data: JSON.stringify({
            "id": api_read["id"],
            "message": document.getElementById("revize-content").value,
        }),
        success: function (response) {
            createSuccessMessageAlert(response);
            alertMessageHandler();

        },
        error: function (response) {
            createErrorMessageAlert(response);
            alertMessageHandler();
        },
        dataType: "json",
        contentType: "application/json"
    });
}

function openRevizeModal() {

    $('.ui.modal')
        .modal({
            blurring: true
        })
        .modal('show')
    ;

}
