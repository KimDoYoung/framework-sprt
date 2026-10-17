package kr.co.kfs.asseterp.biz.icam.mapper;

import kr.co.kfs.asseterp.biz.icam.dto.IcamDataRes;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/** D10 작업용 그리드: icam02_data 조회가 asseterpdb에서 DTO까지 매핑되는지 본다(읽기 전용) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class IcamDataDbTest {

    @Autowired IcamDataMapper mapper;

    @Test
    void 회사_100의_ICAM_연계_데이터_160행이_그리드_열로_읽힌다() {
        List<IcamDataRes> rows = mapper.selectByCompanyId(100L);
        assertThat(rows).hasSize(160);
        IcamDataRes first = rows.get(0);
        assertThat(first.dataId()).isNotNull();
        assertThat(first.icamCompanyCode()).isNotBlank();
        assertThat(first.infoName()).isNotBlank();
        assertThat(first.trName()).isNotBlank();
        assertThat(first.createDateString()).isNotBlank();
    }

    @Test
    void 공통_회사_0은_운용사_코드가_없어_0행이다() {
        assertThat(mapper.selectByCompanyId(0L)).isEmpty();
    }
}
