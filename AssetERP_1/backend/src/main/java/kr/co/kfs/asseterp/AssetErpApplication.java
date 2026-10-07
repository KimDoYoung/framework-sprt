package kr.co.kfs.asseterp;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
@ConfigurationPropertiesScan
@MapperScan("kr.co.kfs.asseterp.biz.**.mapper")
public class AssetErpApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(AssetErpApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(AssetErpApplication.class, args);
    }
}
