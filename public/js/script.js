document.addEventListener("DOMContentLoaded", () => {
// ==========================================
    // 1. TEMA YÖNETİMİ (Karanlık/Aydınlık Tema)
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const mainLogo = document.getElementById('main-logo');     
    const footerLogo = document.getElementById('footer-logo'); 

    // 1. Kayıtlı temayı al. Eğer kayıt yoksa kullanıcının işletim sistemi temasına (Dark/Light) bak
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // 2. Temayı ve logoları her yere kusursuz uygulayan ana fonksiyon
    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            if (themeToggleBtn) {
                themeToggleBtn.querySelector('i').className = 'fa-solid fa-sun';
            }
            // Karanlık tema aktifse logoları beyaza çevir
            if (mainLogo) mainLogo.src = 'images/logolar/sirket-logo-beyaz.png'; 
            if (footerLogo) footerLogo.src = 'images/logolar/sirket-logo-beyaz.png'; 
        } else {
            htmlElement.removeAttribute('data-theme');
            if (themeToggleBtn) {
                themeToggleBtn.querySelector('i').className = 'fa-solid fa-moon';
            }
            // Aydınlık tema aktifse logoları siyaha çevir
            if (mainLogo) mainLogo.src = 'images/logolar/mukellef-portal-logo.png'; 
            if (footerLogo) footerLogo.src = 'images/logolar/mukellef-portal-logo.png'; 
        }
    }

    // 3. Sayfa ilk yüklendiğinde hafızadaki/sistemdeki temayı uygula
    applyTheme(currentTheme);

    // 4. Butona tıklandığında temayı değiştir ve hafızaya kaydet
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = htmlElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark'; // Mevcut durumun tersini al
            
            localStorage.setItem('theme', newTheme); // Seçimi kaydet
            applyTheme(newTheme); // Yeni temayı ekrana bas
        });
    }

    // ==========================================
    // 2. YAPIŞKAN (STICKY) HEADER
    // ==========================================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ==========================================
    // 3. MOBİL MENÜ & SCROLL KİLİDİ
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbar = document.getElementById('navbar');
    let savedScrollY = 0;

    function lockBodyScroll() {
        savedScrollY = window.scrollY || document.documentElement.scrollTop;
        document.body.style.top = `-${savedScrollY}px`;
        document.body.classList.add('menu-open');
    }

    function unlockBodyScroll() {
        if (!document.body.classList.contains('menu-open')) return;
        document.body.classList.remove('menu-open');
        document.body.style.top = '';
        window.scrollTo({ top: savedScrollY, left: 0, behavior: 'instant' });
    }

    function closeMobileMenu() {
        if (!navbar) return;
        navbar.classList.remove('active');
        if (mobileMenuBtn) {
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
        }
        unlockBodyScroll();
    }

    if (mobileMenuBtn && navbar) {
        const menuIcon = mobileMenuBtn.querySelector('i');
        mobileMenuBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
            const isOpen = navbar.classList.contains('active');

            if (menuIcon) {
                menuIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }

            if (isOpen) {
                lockBodyScroll();
            } else {
                unlockBodyScroll();
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navbar.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Mobil Açılır Menü (Dropdown) Desteği
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // ==========================================
    // 4. SCROLL ANİMASYONLARI (Intersection Observer)
    // ==========================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            scrollObserver.observe(el);
        });
    }

    // ==========================================
    // 5. SCROLLSPY (Aktif Menü Linki Güncelleme)
    // ==========================================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    // ==========================================
    // 6. YUKARI ÇIK BUTONU VE İLERLEME ÇEMBERİ
    // ==========================================
    const scrollBtn = document.getElementById("progress-scroll-btn");
    const progressPath = document.querySelector(".progress-circle path");
    
    if (scrollBtn && progressPath) {
        const pathLength = progressPath.getTotalLength();
        progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        progressPath.style.strokeDashoffset = pathLength;

        const updateProgress = () => {
            const scroll = window.scrollY || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            const progress = pathLength - (scroll * pathLength) / height;
            progressPath.style.strokeDashoffset = progress;

            if (scroll > 200) {
                scrollBtn.classList.add("active");
            } else {
                scrollBtn.classList.remove("active");
            }
        };

        scrollBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        window.addEventListener("scroll", updateProgress);
    }

    // ==========================================
    // 7. WHATSAPP LİNK KONTROLÜ (PC/Mobil)
    // ==========================================
    const whatsappLink = document.getElementById('whatsapp-link');
    const phoneNumber = '0552 285 55 61';

    if (whatsappLink) {
        whatsappLink.addEventListener('click', (e) => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (!isMobile) {
                e.preventDefault(); 
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    const originalHTML = whatsappLink.innerHTML;
                    whatsappLink.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(() => {
                        whatsappLink.innerHTML = originalHTML;
                    }, 2000);
                }).catch(err => {
                    console.error('Numara kopyalanamadı: ', err);
                });
            }
        });
    }

    // ==========================================
    // 8. PHP MAILER İLETİŞİM FORMU (AJAX)
    // ==========================================
    const formElement = document.getElementById('mukellef-iletisim-formu');

    if (formElement) {
        formElement.addEventListener('submit', function (event) {
            event.preventDefault(); 
            const submitBtn = document.getElementById('form-submit-btn');
            const originalBtnText = submitBtn ? submitBtn.innerText : "Gönder";

            if (submitBtn) {
                submitBtn.innerText = "Gönderiliyor...";
                submitBtn.disabled = true;
                submitBtn.style.opacity = "0.7";
            }

            const formData = new FormData(this);

            fetch('send-mail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error('Sunucu hatası oluştu');
                return response.json();
            })
            .then(data => {
                if (!data.basarili) throw new Error(data.mesaj || 'Gönderim başarısız');
                alert('Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.');
                formElement.reset(); 
            })
            .catch((error) => {
                console.error('Form Gönderim Hatası:', error);
                alert('Mesaj gönderilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                }
            });
        });
    }

    // ==========================================
    // 9. YORUMLAR (TESTIMONIALS) SLIDER (Sonsuz & Autoplay)
    // ==========================================
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('t-prev');
    const nextBtn = document.getElementById('t-next');
    const container = document.querySelector('.testimonial-track-container');
    
    if (track && container) {
        let isAnimating = false; 
        const gap = 20; 

        function getCardWidth() {
            const card = track.querySelector('.testimonial-card');
            return card ? card.offsetWidth + gap : 0;
        }

        // İleri Butonu
        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;
                
                const moveAmount = getCardWidth();
                track.style.transition = 'transform 0.4s ease-in-out';
                track.style.transform = `translateX(-${moveAmount}px)`;
                
                setTimeout(() => {
                    track.style.transition = 'none'; 
                    track.appendChild(track.firstElementChild); 
                    track.style.transform = 'translateX(0)'; 
                    isAnimating = false;
                }, 400); 
            });
        }

        // Geri Butonu
        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;
                
                const moveAmount = getCardWidth();
                track.insertBefore(track.lastElementChild, track.firstElementChild);
                track.style.transition = 'none';
                track.style.transform = `translateX(-${moveAmount}px)`;
                track.offsetHeight; 
                
                track.style.transition = 'transform 0.4s ease-in-out';
                track.style.transform = 'translateX(0)';
                
                setTimeout(() => {
                    isAnimating = false;
                }, 400);
            });
        }

        // Mobil Swipe (Kaydırma) Desteği
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        container.addEventListener('mousedown', e => {
            touchStartX = e.screenX;
        });

        container.addEventListener('mouseup', e => {
            touchEndX = e.screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                if (nextBtn) nextBtn.click(); 
            }
            if (touchEndX > touchStartX + 50) {
                if (prevBtn) prevBtn.click(); 
            }
        }

        // Otomatik Oynatma (Auto-Play) Sistemi
        let autoPlayInterval;
        const autoPlayDelay = 4000; 

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                if (nextBtn) nextBtn.click(); 
            }, autoPlayDelay);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        startAutoPlay();
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);
        container.addEventListener('touchstart', stopAutoPlay, { passive: true });
        container.addEventListener('touchend', startAutoPlay, { passive: true });
    }

    // ==========================================
    // 10. DİNAMİK SAYAÇ (COUNT-UP) ANİMASYONU
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    if (counters.length > 0) {
        // Observer: İstatistik alanı ekranda %50 oranında göründüğünde çalıştır
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true; // Sayfanın altına/üstüne inilirse tekrar saymasını engeller
                    
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const prefix = counter.getAttribute('data-prefix') || '';
                        const suffix = counter.getAttribute('data-suffix') || '';
                        const duration = 2000; // Sayma animasyonunun toplam süresi (2 saniye)
                        
                        // 60 FPS baz alınarak her adımda eklenecek sayı miktarı
                        const increment = target / (duration / 16); 
                        
                        let currentCount = 0;
                        
                        const updateCounter = () => {
                            currentCount += increment;
                            
                            if (currentCount < target) {
                                counter.innerText = prefix + Math.ceil(currentCount) + suffix;
                                requestAnimationFrame(updateCounter); // Pürüzsüz animasyon için
                            } else {
                                // Küsuratları temizle ve tam sayıyı yazdır
                                counter.innerText = prefix + target + suffix;
                            }
                        };
                        
                        updateCounter();
                    });
                }
            });
        }, { threshold: 0.5 }); // 0.5 = Elementin %50'si ekrana girince başla

        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            counterObserver.observe(statsContainer);
        }
    }
    // ==========================================
    // 12. PRELOADER (YÜKLEME EKRANI)
    // ==========================================
    // Sayfadaki tüm resimler ve dosyalar yüklendiğinde çalışır (load eventi)
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            // Yükleme çok hızlı bitse bile animasyonun şık görünmesi için 0.5 saniye ekranda tutuyoruz
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 500); 
        }
    });

    // ==========================================
    // 11. & 13. 3D CAROUSEL ANİMASYONU VE CİHAZ DEĞİŞİMİ
    // ==========================================
    const toggleMobileBtn = document.getElementById('toggle-mobile');
    const toggleDesktopBtn = document.getElementById('toggle-desktop');
    const mockupCarouselBox = document.getElementById('main-mockup-carousel');
    const carouselImgs = document.querySelectorAll('#main-mockup-carousel .carousel-img');

    // --- 1. OTOMATİK DÖNME (KAYMA) ANİMASYONU ---
    if(carouselImgs.length === 3 && mockupCarouselBox) {
        setInterval(() => {
            // Sadece ana kutunun içindeki resimleri seç (Çakışmayı önler)
            const active = mockupCarouselBox.querySelector('.carousel-img.active');
            const next = mockupCarouselBox.querySelector('.carousel-img.next');
            const prev = mockupCarouselBox.querySelector('.carousel-img.prev');

            if(active && next && prev) {
                // Diğer sınıfları (örneğin fade-out) bozmadan sadece yön sınıflarını güvenle değiştir
                active.classList.replace('active', 'prev');
                next.classList.replace('next', 'active');
                prev.classList.replace('prev', 'next');
            }
        }, 3500); // 3.5 saniyede bir resimler kayar
    }

    // --- 2. CİHAZ DEĞİŞTİRME BUTONLARI (Masaüstü / Mobil) ---
    if(toggleMobileBtn && toggleDesktopBtn && mockupCarouselBox) {
        
        function switchDeviceMode(mode) {
            // Masaüstüne geçildiyse kutuyu genişlet, mobildeyse daralt
            if(mode === 'desktop') {
                mockupCarouselBox.classList.add('desktop-mode');
            } else {
                mockupCarouselBox.classList.remove('desktop-mode');
            }

            carouselImgs.forEach(img => {
                img.classList.add('fade-out'); // Resmi güvenle karart
                
                setTimeout(() => {
                    const newSrc = img.getAttribute(`data-${mode}`);
                    if(newSrc) img.src = newSrc; // Yeni resmi yükle
                    
                    img.classList.remove('fade-out'); // Kararmayı kaldır
                }, 300);
            });
        }

        // BİLGİSAYAR BUTONUNA TIKLANINCA
        toggleDesktopBtn.addEventListener('click', () => {
            if(!toggleDesktopBtn.classList.contains('active')) {
                toggleMobileBtn.classList.remove('active');
                toggleDesktopBtn.classList.add('active');
                switchDeviceMode('desktop');
            }
        });

        // TELEFON BUTONUNA TIKLANINCA
        toggleMobileBtn.addEventListener('click', () => {
            if(!toggleMobileBtn.classList.contains('active')) {
                toggleDesktopBtn.classList.remove('active');
                toggleMobileBtn.classList.add('active');
                switchDeviceMode('mobile');
            }
        });
    }

   

});