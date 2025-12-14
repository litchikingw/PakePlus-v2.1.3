// 获取DOM元素
// const body = document.querySelector('body');
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');
const bell = document.getElementById('bell');
const bellSound = document.getElementById('bellSound');
const revealText = document.getElementById('revealText');

document.addEventListener('DOMContentLoaded', function() {

    // 播放/暂停音乐
    musicToggle.addEventListener('click', startOrPauseBackgroundMusic);

    // 音乐加载错误处理
    backgroundMusic.addEventListener('error', function() {
        console.error("音乐加载失败，请检查网络或音乐链接");
        musicToggle.style.borderColor = 'rgba(255, 0, 0, 0.5)';
    });

    initBellEvents();

    // Intersection Observer实例
    let observer = null;
    // 获取所有需要观察的元素
    const fadeElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-up');
    // 初始化Intersection Observer
    function initIntersectionObserver(threshold = 0.1) {
        // 如果已存在观察者，先断开连接
        if (observer) {
            observer.disconnect();
        }

        // 检查浏览器是否支持Intersection Observer
        if ('IntersectionObserver' in window) {
            // 创建Intersection Observer实例
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // 当目标元素进入视口时
                    if (entry.isIntersecting) {
                        // 添加可见类触发动画
                        entry.target.classList.add('visible');

                        // 如果是第一次进入视口，增加计数器
                        if (!entry.target.dataset.animated) {
                            entry.target.dataset.animated = 'true';
                        }
                    } else {
                        // 当目标元素离开视口时，移除可见类（浮出效果）
                        entry.target.classList.remove('visible');
                    }
                });
            }, {
                // 配置选项
                root: null, // 相对于视口
                rootMargin: '0px', // 无额外边界
                threshold: threshold // 可配置的阈值
            });

            // 开始观察所有目标元素
            fadeElements.forEach(element => {
                observer.observe(element);
            });

            // 初始时触发一次，确保在视口中的元素立即显示
            fadeElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    element.classList.add('visible');
                    if (!element.dataset.animated) {
                        element.dataset.animated = 'true';
                    }
                }
            });

        } else {
            // 浏览器不支持Intersection Observer时的回退方案
            console.log('您的浏览器不支持Intersection Observer API，将使用回退方案');

            // 初始显示所有元素（无动画）
            fadeElements.forEach(element => {
                element.classList.add('visible');
            });

            // 简单滚动检测（回退方案）
            window.addEventListener('scroll', function() {
                fadeElements.forEach(element => {
                    const rect = element.getBoundingClientRect();

                    // 检查元素是否在视口中
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        element.classList.add('visible');
                    } else {
                        element.classList.remove('visible');
                    }
                });
            });

            // 初始检测
            window.dispatchEvent(new Event('scroll'));
        }
    }
    // 初始化观察者
    initIntersectionObserver();
});


window.onload = init

// 初始化操作
function init(){
    console.log('页面初始化内容')
}


// 背景音乐
function startOrPauseBackgroundMusic() {
    if (backgroundMusic.paused) {
        // 播放音乐
        backgroundMusic.play();
        musicToggle.classList.add('playing');
    } else {
        // 暂停音乐
        backgroundMusic.pause();
        musicToggle.classList.remove('playing');
    }
}

let isBellRinging = false;
// 初始化铃铛交互事件
function initBellEvents() {
    // 预加载铃铛音效
    if (bellSound) {
        bellSound.load();
    }

    // 初始化铃铛容器动画
    const bellContainer = document.querySelector('.bell-container');
    if (bellContainer) {
        bellContainer.classList.add('init');
    }

    if (bell) {
        bell.addEventListener('click', function() {
            if (isBellRinging) return;

            isBellRinging = true;

            // 添加铃铛摆动动画
            bell.classList.add('ring');

            // 播放铃铛音效
            if (bellSound) {
                bellSound.currentTime = 0;

                // 尝试播放铃铛音效，如果失败则显示错误信息
                const playPromise = bellSound.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('铃铛音效播放成功');
                    }).catch(error => {
                        console.error('铃铛音效播放失败:', error);
                        // 显示提示信息
                        // showBellSoundError();
                    });
                }
            } else {
                console.error('未找到铃铛音效元素');
                // showBellSoundError();
            }

            // 显示隐藏文字
            if (revealText) {
                setTimeout(() => {
                    revealText.classList.add('show');
                }, 500);
            }

            // 移除动画类
            setTimeout(() => {
                bell.classList.remove('ring');
                isBellRinging = false;
            }, 1000);
        });
    }
}