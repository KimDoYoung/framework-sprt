package kr.co.kfs.asseterp.biz.car.service;

import static kr.co.kfs.asseterp.support.XlsxFiles.row;
import static kr.co.kfs.asseterp.support.XlsxFiles.xlsx;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** 차량운행 엑셀 업로드(ExcelCells.string 사용)를 asseterpdb 에 넣어 보고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(CarJournalUploadService.class)
class CarJournalUploadDbTest {

    @Autowired CarJournalUploadService service;
    @Autowired JdbcTemplate jdbc;

    private final UserPrincipal user = UserPrincipal.builder().userId(-28656L).companyId(28000L).roles(List.of("ROLE_ADMIN")).build();

    private Long infoId() {
        return jdbc.queryForObject("select car01_info_id from car01_info where car01_company_id = 28000 limit 1", Long.class);
    }

    @Test
    void 하루_한_행으로_거리_합과_행선지_목적을_넣고_숫자_행선지는_글자로_읽는다() {
        Long info = infoId();
        long personId = 29049L;
        int n = service.upload(user, personId, info, xlsx(
                row("2099-03-01", 10, 20, 5, "서울", "회의"),
                row("2099-03-02", null, null, null, 123, null)));
        assertThat(n).isEqualTo(2);
        assertThat(jdbc.queryForObject("select car04_mileage from car04_journal where car04_company_id = 28000 and car04_info_id = ? and car04_date = date '2099-03-01'", Long.class, info)).isEqualTo(35L);
        assertThat(jdbc.queryForObject("select car04_destination from car04_journal where car04_company_id = 28000 and car04_info_id = ? and car04_date = date '2099-03-02'", String.class, info)).isEqualTo("123");
    }

    @Test
    void 없는_차량_빈_파일_빈_사용일자를_거절한다() {
        assertThatThrownBy(() -> service.upload(user, 29049L, -1L, xlsx(row("2099-03-01")))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.upload(user, 29049L, infoId(), null)).isInstanceOf(BusinessException.class).hasMessage("등록할 파일이 전달되지 않았습니다.");
        assertThatThrownBy(() -> service.upload(user, 29049L, infoId(), xlsx(row((Object) null)))).isInstanceOf(BusinessException.class).hasMessageContaining("사용일자는 필수입력");
    }
}
