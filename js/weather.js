$(function () {
    //基础路径变量
    var baseUrl = './img/';

    //配置天气图标
    var weatherIcons = {

        yun: {
            title: '多云',
            icon: 'yun.png'
        },
        qing: {
            title: '晴',
            icon: 'qing.png'
        },
        yin: {
            title: '阴',
            icon: 'yin.png'
        },
        lei: {
            title: '雷',
            icon: 'lei.png'
        },
        yu: {
            title: '雨',
            icon: 'yu.png'
        },
        yu: {
            title: '阵雨',
            icon: 'zhen.png'
        },
        defalut: {
            title: '未知',
            icon: ''
        }
    }
    //获取天气数据
    function getWeatherData(city) {

        var data = {
                    appid: '52841558',
                    appsecret: 'g72pn7wc',
                    version: 'v6',
         }
        if(city !== undefined){
            data.city = city;
        }

        $.ajax({
            type: 'GET',
            url: 'https://www.tianqiapi.com/api',
            data:data,
            dataType: 'jsonp',
            success: function (data) {
                // console.log('data==>',data);
                //获取定位 城市
                $('.location-city').text(data.city);

                //绑定实况天气
                var weatherData = ['date', 'week', 'tem', 'wea', 'air_level', 'win', 'win_speed', 'win_meter'];

                for (var i = 0; i < weatherData.length; i++) {
                    if (weatherData[i] == 'wea') {
                        $('.' + weatherData[i]).css({
                            backgroundImage: 'url(' + baseUrl + (weatherIcons[data.wea_img] == undefined ? weatherIcons.default : weatherIcons[data.wea_img]).icon + ')',
                        });
                    } else {
                        $('.' + weatherData[i]).text(weatherData[i] === 'tem' ? data[weatherData[i]] + '℃' : data[weatherData[i]]);

                    }


                }
                // //日期
                // $('.date').text(data.date);
                // //星期
                // $('.week').text(data.week);
                // //摄氏度
                // $('.tem').text(data.tem + "℃");
                // //天气
                // $('.wea').text(data.wea);
                // //空气质量
                // $('.air_level').text(data.air_level);
                // //风向
                // $('.win').text(data.win);
                // //等级
                // $('.win_speed').text(data.win_speed);
                // //风速
                // $('.win_meter').text(data.win_meter);

                //获取24小时天气和未来6天天气
                var information = {
                        appid: '52841558',
                        appsecret: 'g72pn7wc',
                        version: 'v9',
                };

                if(city !== undefined){
                    information.city = city;
                }

                $.ajax({
                    type: 'get',
                    url: 'https://www.tianqiapi.com/api',
                    data:information,
                    dataType: 'jsonp',
                    success: function (result) {
                        console.log(result);
                        //绑定24小时天气数据
                        var hoursData = result.data[0].hours;

                        var hoursNum = (result.data[0].hours).length;

                        $('.hours-title').text(hoursNum + '小时天气');
                        
                        $.each(hoursData, function (i, v) {
                            
                            var $li = $(`<li>
                                    <div>${v.hours}</div>
                                    <div class="cloud-icon" style="background-image: url(${baseUrl + (weatherIcons[v.wea_img] == undefined ? weatherIcons.defalult : weatherIcons[v.wea_img]).icon})"></div>
                                    <div>${v.tem}℃</div>
                                    <div>${v.win}</div>
                                </li>`);
                            $('#hoursWeather').append($li);

                        })
                        //未来六天
                        var futureWeatherData = result.data.slice(1);
                        console.log(futureWeatherData);
                        $.each(futureWeatherData, function (i, v) {
                            var $li = $(`<li class="clearfix">
                                    <span>${v.day.replace(/（星期[一二三四五六日]）/, '')}</span>
                                    <span>
                                    <i class="future-six-icon" style="background-image: url(${baseUrl + (weatherIcons[v.wea_img] == undefined ? weatherIcon.defalult : weatherIcons[v.wea_img]).icon})"></i>
                                    </span>
                                    <span>${v.tem2 + '℃ ~' + v.tem1 + '℃'}</span>
                                    <span class="w-dir">${v.win[1]}</span>
                                    </li>`);
                            $('#futureWeather').append($li);
                        })
                    }
                })
            }
        })
    }

    getWeatherData();

    //搜索城市
    $('.search-icon').click(function(){
        //获取搜索城市
        var city = $('.search').val();

        //如果没输入 和空格的时候 直接返回
        if(city == undefined || city.trim() == ''){
            return;
        }
        //清空上次城市天气数据
        $('#hoursWeather,#futureWeather').empty();
        getWeatherData(city);
    })

})