package com.VKJ.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:8889",
                        "http://localhost:5173",
                        "http://localhost:3000",
                        "http://towing1.s3-website.ap-south-1.amazonaws.com",
                        "http://teaberry-web.s3-website.ap-south-1.amazonaws.com",
                        "http://teaberry-admin.s3-website.ap-south-1.amazonaws.com",
                        "http://51.21.161.51",
                        "http://51.21.161.51:8888",
                        "http://43.204.228.219",
                        "http://43.204.228.219:9050",
                        "http://teaberry-admin-frontend.s3-website.eu-north-1.amazonaws.com/",
                        "http://teaberry-frontend-admin.s3-website.ap-south-1.amazonaws.com",
                        "http://teaberry-admin-frontend.s3-website.eu-north-1.amazonaws.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0);
    }
}