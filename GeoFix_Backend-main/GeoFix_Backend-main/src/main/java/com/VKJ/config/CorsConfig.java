package com.VKJ.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("http://localhost:5173");
        corsConfiguration.addAllowedOrigin("http://localhost:8081");
        corsConfiguration.addAllowedOrigin("http://localhost:3000");
        corsConfiguration.addAllowedOrigin("http://towing1.s3-website.ap-south-1.amazonaws.com");
        corsConfiguration.addAllowedOrigin("http://192.168.x.x:3000");
        corsConfiguration.addAllowedOrigin("http://169.254.127.152:3000");
        corsConfiguration.addAllowedOrigin("http://51.21.161.51");
        corsConfiguration.addAllowedOrigin("http://51.21.161.51:8888");
        corsConfiguration.addAllowedOrigin("http://43.204.228.219");
        corsConfiguration.addAllowedOrigin("http://43.204.228.219:9050");
        corsConfiguration.addAllowedOrigin("http://teaberry-admin-frontend.s3-website.eu-north-1.amazonaws.com");
        corsConfiguration.addAllowedOrigin("http://teaberry-admin-frontend.s3-website.eu-north-1.amazonaws.com/");
        corsConfiguration.addAllowedOrigin("http://teaberry-web.s3-website.ap-south-1.amazonaws.com");
        corsConfiguration.addAllowedOrigin("http://teaberry-admin.s3-website.ap-south-1.amazonaws.com");
        corsConfiguration.addAllowedOrigin("http://teaberry-frontend-admin.s3-website.ap-south-1.amazonaws.com");

        corsConfiguration.addAllowedMethod("GET");
        corsConfiguration.addAllowedMethod("POST");
        corsConfiguration.addAllowedMethod("PUT");
        corsConfiguration.addAllowedMethod("DELETE");
        corsConfiguration.addAllowedMethod("OPTIONS");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }
}