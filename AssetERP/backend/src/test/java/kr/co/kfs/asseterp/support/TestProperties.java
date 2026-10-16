package kr.co.kfs.asseterp.support;

import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.context.properties.bind.PropertySourcesPlaceholdersResolver;
import org.springframework.boot.context.properties.source.ConfigurationPropertySources;
import org.springframework.boot.env.PropertiesPropertySourceLoader;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.List;

/**
 * 스프링 컨텍스트 없이 실제 application.properties 값을 @ConfigurationProperties 레코드로 바인딩한다.
 */
public final class TestProperties {

    private static final Binder BINDER = createBinder();

    private TestProperties() {
    }

    public static <T> T bind(String prefix, Class<T> type) {
        return BINDER.bind(prefix, type).get();
    }

    private static Binder createBinder() {
        try {
            List<PropertySource<?>> sources = new PropertiesPropertySourceLoader()
                    .load("application", new ClassPathResource("application.properties"));
            return new Binder(ConfigurationPropertySources.from(sources),
                    new PropertySourcesPlaceholdersResolver(sources));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
