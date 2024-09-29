'use strict'

const data = [];
// 替换游戏主图
imageFile.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            // 移除原视频元素
            var oldVideo = document.querySelector('video');
            if (oldVideo) {
                oldVideo.pause();
                oldVideo.remove(); 
            }
            videoFile.value = '';

            topDiv.style.backgroundColor = 'black';
            topDiv.style.backgroundImage = `url(${canvas.toDataURL()})`;
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});
// 替换游戏背景视频
videoFile.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file && file.type === 'video/mp4') {
        // 创建video元素
        var videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(file); // 创建URL对象
        videoElement.play(); // 播放视频
        videoElement.onended = function() {
            videoElement.play(); // 循环播放
        };

        // 设置样式使其覆盖整个背景
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.position = 'absolute';
        videoElement.style.top = '0';
        videoElement.style.left = '0';
        videoElement.style.zIndex = '-1'; // 确保视频在背景中
        videoElement.style.objectFit = 'cover'; // 让视频覆盖整个背景

        // 隐藏其他背景元素
        topDiv.style.backgroundColor = 'transparent';
        topDiv.style.backgroundImage = 'none';
        imageFile.value = '';
        // 移除原视频元素
        var oldVideo = document.querySelector('video');
        if (oldVideo) {
            oldVideo.pause();
            oldVideo.remove(); 
        }
        // 将视频添加到背景容器中
        topDiv.appendChild(videoElement);
    }
});
// 获取csv文件
textFile.addEventListener('change', function(e) {
    // 使用FileReader读取文件
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        // 使用字符串的split方法按行分割
        const lines = text.split('\r\n');
        // 解析每一行
        lines.forEach((line, index) => {
            if( index > 0){// 跳过第一行
                // 使用split按逗号分割每一个字段
                const fields = line.split(',');
                // 处理每个字段
                data.push({
                    deviceType: fields[0],
                    gpuType: fields[1],
                    quality: fields[2]
                });
            }
        });
    };
    reader.readAsText(file,"utf-8");
});
// 为gameName添加input事件监听器
gameName.addEventListener('input', function() {
    if (this.value) {
        gameTitle.innerText = this.value + '配置查询器';
        document.title = this.value + '游戏设备画质查询器';
    }else {
        gameTitle.innerText = '游戏配置查询器';
        document.title ='游戏设备画质查询器';
    }
});
var radios = document.getElementsByName('bgSetting');
radios.forEach(function(radio) {
    radio.addEventListener('change', function() {
        if (this.checked) {
            if (this.value == '2') {// 透明黑色背景
                deviceArea.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
            }else if (this.value == '3') { // 透明白色背景
                deviceArea.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            }else{
                deviceArea.style.backgroundColor = '';
            }
        }
    });
});
// 为heightPosition添加input事件监听器
heightPosition.addEventListener('input', function() {
    deviceArea.style.top = this.value + '%';
})
// 为widthPosition添加input事件监听器
widthPosition.addEventListener('input', function() {
    deviceArea.style.left = this.value + '%';
})
// 为deviceType添加input事件监听器
deviceType.addEventListener('input', function() {
    gpuType.value = '';
    deviceItems.innerHTML = '';
    fuzzyMatchArray(data, 'deviceType', this.value).forEach(item => {
        if (this.value && item.deviceType != this.value) {// 避免重复选项
            deviceItems.appendChild(new Option(item.deviceType, item.deviceType));
        }
    })
    const result = fuzzyFind(data, 'deviceType', this.value);
    if (result) {
        gpuType.value = result.gpuType;
        quality.value = result.quality;
    } else {
        gpuType.value = '';
        quality.value = '';
    }
});
// 为gpuType添加input事件监听器
gpuType.addEventListener('input', function() {
    deviceType.value = '';
    gpuItems.innerHTML = '';
    fuzzyMatchArray(data, 'gpuType', this.value).forEach(item => {
        if (this.value && item.gpuType != this.value){// 避免重复选项
            gpuItems.appendChild(new Option(item.gpuType, item.gpuType));
        }
    })
    const result = fuzzyFind(data, 'gpuType', this.value);
    if (result) {
        deviceType.value = result.deviceType;
        quality.value = result.quality;
    } else {
        deviceType.value = '';
        quality.value = '';
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") { // 检查按下的是否是ESC键
        if (document.getElementById('setting').style.display === 'block') {
            document.getElementById('setting').style.display = 'none';
        } else {
            document.getElementById('setting').style.display = 'block';
        }
    }
});
// 模糊匹配函数
function fuzzyFind(array, key, value) {
    const pattern = new RegExp(value, 'i'); // 'i' 表示不区分大小写
    return array.find(item => pattern.test(item[key]));
}

function fuzzyMatchArray(array, key, value) {
    const regex = new RegExp(value, 'i'); // 'i' 表示不区分大小写
    return array.filter(item => regex.test(item[key]));
}