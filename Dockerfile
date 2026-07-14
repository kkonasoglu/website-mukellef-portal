# PHP 8.2 ve Apache yüklü resmi imajı baz alıyoruz
FROM php:8.2-apache

# Gerekirse sık kullanılan PHP uzantılarını buraya ekleyebilirsiniz (örneğin MySQL için pdo_mysql)
RUN docker-php-ext-install pdo pdo_mysql

# Apache'nin Rewrite modülünü aktif ediyoruz (htaccess ve temiz URL'ler için çok işe yarar)
RUN a2enmod rewrite

# Çalışma dizinimizi belirliyoruz
WORKDIR /var/www/html

# Proje dosyalarımızı Apache'nin varsayılan yayın klasörüne kopyalıyoruz
COPY ./public /var/www/html

# Dosya izinlerini Apache kullanıcısına (www-data) göre ayarlıyoruz
RUN chown -R www-data:www-data /var/www/html