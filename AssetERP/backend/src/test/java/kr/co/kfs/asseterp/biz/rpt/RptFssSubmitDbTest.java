package kr.co.kfs.asseterp.biz.rpt;

import kr.co.kfs.asseterp.biz.rpt.dto.RptFssSubmitRes;
import kr.co.kfs.asseterp.biz.rpt.dto.RptFssSubmitSaveReq;
import kr.co.kfs.asseterp.biz.rpt.service.RptFssSubmitService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** E19 금감원 업무보고서(Rpt10_FssSubmit)의 쓰기를 asseterpdb에서 실제로 돌리고 롤백한다 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(RptFssSubmitService.class)
class RptFssSubmitDbTest {

    @Autowired RptFssSubmitService service;
    @Autowired JdbcTemplate jdbc;

    @Test
    void 조회는_보고서코드_LIKE_대소문자_무시() {
        int all = jdbc.queryForObject("select count(*) from rpt10_fss_submit", Integer.class);
        assertThat(service.search("")).hasSize(all);
        assertThat(service.search("ga14")).extracting(RptFssSubmitRes::reportCode).allMatch(c -> c.startsWith("GA14"));
    }

    @Test
    void 등록_수정_삭제와_코드_검사() {
        RptFssSubmitRes created = service.save(new RptFssSubmitSaveReq(null, "ZT001", "시험보고서", "04", "대상", "요령", "연혁"));
        assertThat(created.submitId()).isPositive();
        assertThat(created.submitCycleName()).isNotNull();

        RptFssSubmitRes updated = service.save(new RptFssSubmitSaveReq(created.submitId(), "ZT001", "시험보고서2", "04", "대상", "요령2", null));
        assertThat(updated.reportName()).isEqualTo("시험보고서2");
        assertThat(updated.reviseHistory()).isNull();

        assertThatThrownBy(() -> service.save(new RptFssSubmitSaveReq(null, "ZT001", "중복", null, null, null, null))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.save(new RptFssSubmitSaveReq(null, "", "x", null, null, null, null))).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.save(new RptFssSubmitSaveReq(null, "ABCDEF", "x", null, null, null, null))).isInstanceOf(BusinessException.class);

        assertThat(service.delete(List.of(created.submitId()))).isEqualTo(1);
        assertThat(service.delete(List.of())).isZero();
    }
}
