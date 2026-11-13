package kr.co.kfs.asseterp.biz.ics;

import kr.co.kfs.asseterp.biz.apr.dto.IcsWriterReportRow;
import kr.co.kfs.asseterp.biz.apr.mapper.AprIcsWriterLinkMapper;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteApprIdReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriteApprRes;
import kr.co.kfs.asseterp.biz.ics.service.IcsComplianceWriteService;
import kr.co.kfs.asseterp.common.error.BusinessException;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * #1310 내부통제 준수확인서 작성 — 작성자 상신(원본 2026-11-04·05, CH-0049·0052~0055·0103~0106·0182): 회사 설정 상신자 1이면 [결재요청](A53).
 * asseterpdb에서 돌리고 롤백한다.
 */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(IcsComplianceWriteService.class)
class IcsComplianceWriteApprDbTest {

    private static final LocalDate STD = LocalDate.of(2024, 10, 31);   // 시험 DB: 29049의 2024.10 월(M) 작성이 있다

    @Autowired IcsComplianceWriteService service;
    @Autowired AprIcsWriterLinkMapper writerMapper;
    @Autowired JdbcTemplate jdbc;
    @Autowired org.apache.ibatis.session.SqlSession sqlSession;

    private final UserPrincipal user = UserPrincipal.builder().userId(29049L).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();

    @Test
    void 회사_설정_상신자를_읽는다() {
        jdbc.update("update sys01_company set sys01_comply_appr_reg_emp_type = '1' where sys01_company_id = 28000");
        assertThat(service.apprRegEmpType(user)).isEqualTo("1");
    }

    @Test
    void A53_본문은_준수항목별_결과와_미준수_사유() {
        List<IcsWriterReportRow> rows = writerMapper.selectWriterReport(28000L, 29049L, "M", STD);
        assertThat(rows).isNotEmpty().allMatch(r -> r.complianceTypeName() != null && r.complianceResult() != null);
        assertThat(rows).filteredOn(r -> r.reason() != null).allMatch(r -> r.reason().startsWith(" - "));
    }

    @Test
    void 상신하면_그_달_상태와_문서목록과_최근_문서분류가_나온다() {
        // 출발점: 이 사원의 작성자 상신 연결(유형 2)을 비운다 — DB 사본에 더 늦은 달 연결(지워진 문서 포함)이 있으면 "최근 문서분류"가 그쪽을 본다(롤백)
        jdbc.update("delete from ics32_relate_appr where ics32_company_id = 28000 and ics32_person_id = 29049 and ics32_appr_type = '2'");
        assertThat(service.appr(user, STD, "M")).isNull();                        // 미상신
        Long apprId = jdbc.queryForObject("select max(apr01_appr_id) from apr01_appr where apr01_company_id = 28000 and apr01_reg_emp_id = 29049", Long.class);
        Long classTreeId = jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, apprId);

        // A53 문서가 아니면 기록하지 않는다(보안 보강)
        assertThatThrownBy(() -> service.insertApprId(user, new IcsComplianceWriteApprIdReq(STD, "M", apprId))).isInstanceOf(BusinessException.class);

        jdbc.update("update apr01_appr set apr01_link_cd = 'A53' where apr01_appr_id = ?", apprId);
        sqlSession.clearCache();   // 같은 트랜잭션의 앞 조회 결과(1차 캐시)를 비운다
        service.insertApprId(user, new IcsComplianceWriteApprIdReq(STD, "M", apprId));

        IcsComplianceWriteApprRes appr = service.appr(user, STD, "M");
        assertThat(appr).isNotNull();
        assertThat(appr.apprId()).isEqualTo(apprId);
        assertThat(appr.statusName()).isNotBlank();
        assertThat(service.apprIds(user, STD, "M")).containsExactly(apprId);
        assertThat(service.lastClassTreeId(user)).isEqualTo(classTreeId);
        // 다른 달은 미상신
        assertThat(service.appr(user, LocalDate.of(2024, 9, 30), "M")).isNull();
    }
}
