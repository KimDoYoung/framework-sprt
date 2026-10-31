package kr.co.kfs.asseterp.biz.apr;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import kr.co.kfs.asseterp.biz.apr.dto.AprLinkSeedRes;
import kr.co.kfs.asseterp.biz.apr.service.AprLinkSeedService;
import kr.co.kfs.asseterp.biz.apr.service.link.TransportLinkSeedProvider;
import kr.co.kfs.asseterp.biz.apr.service.link.UnLeaveLinkSeedProvider;
import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransportApprService;
import kr.co.kfs.asseterp.common.error.BusinessException;

/** V36 A15 미사용휴가 지정통보서 · A42 여비교통비 신청서 결재창 제목·본문과 영수증 파일 연결을 asseterpdb에서 돌리고 롤백한다(03 원칙 2) */
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({AprLinkSeedService.class, UnLeaveLinkSeedProvider.class, TransportLinkSeedProvider.class, EmpTransportApprService.class})
class AprUnLeaveTransportLinkSeedDbTest {

    private static final long UNLEAVE_YEAR = 202407091723933L;   // 구분 01 (연차)
    private static final long UNLEAVE_MONTH = 202608119820892L;  // 구분 03 (월차)
    private static final long APPR = 202609229873969L;
    private static final long TRANSPORT_FILE_ROW = 202408231929753L; // 영수증 파일 있는 행 (사원 202204180108329)

    @Autowired AprLinkSeedService seedService;
    @Autowired EmpTransportApprService fileService;
    @Autowired JdbcTemplate jdbc;

    private static UserPrincipal user(long userId) {
        return UserPrincipal.builder().userId(userId).companyId(28000L).name("시험").roles(List.of("ROLE_USER")).build();
    }

    private Long classTreeId() {
        return jdbc.queryForObject("select apr01_class_tree_id from apr01_appr where apr01_appr_id = ?", Long.class, APPR);
    }

    @Test
    void 연차_지정통보서는_연차_낱말로_표를_만든다() {
        AprLinkSeedRes res = seedService.seed(user(29025L), classTreeId(), "A15", UNLEAVE_YEAR, Map.of("stdYear", "2024"));
        assertThat(res.title()).startsWith("미사용 연차유급휴가 사용 시기 지정통보서_").doesNotContain("월차");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("미사용 연차유급휴가 사용 시기 지정통보서", "\" 미사용 연차유급휴가일수\"", "본인의 미사용 연차 유급휴가", "의무사용연차<br>(B=A*",
                "※ 의무사용연차를 초과하여 발생연차까지는 모두 사용 가능합니다.", "2. 미사용 연차유급휴가 사용 시기 지정 통보내역", "사 용 시 기 지 정 일")
                .doesNotContain("월차");
        // 구분 01 은 월 칸 여섯 줄이 모두 채워진다
        assertThat(res.content().split("YYYY", -1).length).isEqualTo(1);
        assertThat(res.content().split("년 ", -1).length - 1).isGreaterThanOrEqualTo(6);
    }

    @Test
    void 월차_지정통보서는_월차_낱말로_표를_만든다() {
        AprLinkSeedRes res = seedService.seed(user(202511249196644L), classTreeId(), "A15", UNLEAVE_MONTH, Map.of("stdYear", "2026"));
        assertThat(res.title()).startsWith("미사용 월차유급휴가 사용 시기 지정통보서_");
        assertThat(res.content()).contains("미사용 월차유급휴가 사용 시기 지정통보서", "\" 미사용 월차유급휴가일수\"", "의무사용월차<br>(B=A*", "발생월차까지는").doesNotContain("연차");
    }

    @Test
    void 지정통보서_정보가_없으면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(29025L), 1L, "A15", null, Map.of("stdYear", "2024")));
        assertThrows(BusinessException.class, () -> seedService.seed(user(29025L), 1L, "A15", UNLEAVE_YEAR, Map.of()));
        assertThrows(BusinessException.class, () -> seedService.seed(user(29025L), 1L, "A15", -1L, Map.of("stdYear", "2024")));
        // 다른 회사 사원은 볼 수 없다
        UserPrincipal other = UserPrincipal.builder().userId(1L).companyId(1L).name("타사").roles(List.of("ROLE_USER")).build();
        assertThrows(BusinessException.class, () -> seedService.seed(other, 1L, "A15", UNLEAVE_YEAR, Map.of("stdYear", "2024")));
    }

    @Test
    void 여비교통비_신청서는_고른_줄과_합계를_넣는다() {
        AprLinkSeedRes res = seedService.seed(user(29049L), classTreeId(), "A42", null,
                Map.of("ids", "202504142262690,202504142262692,202504142262693", "regNo", "R-7", "regDate", "2025.03"));
        assertThat(res.title()).isEqualTo("여비교통비 신청서 (2025.03) - 시험#R-7");
        assertThat(res.titleReadOnly()).isFalse();
        assertThat(res.saveVisible()).isFalse();
        assertThat(res.content()).contains("2025-03-10", "2025-03-20", "2025-03-28", "여의도", "장안동", "23,500&nbsp;", "70,500&nbsp;", "합 계",
                "상기와 여하 업무차 여비 및 교통비를 신청합니다.", "(전자결재)");
    }

    @Test
    void 여비교통비_신청서는_내용이_없거나_남의_행이면_열_수_없다() {
        assertThrows(BusinessException.class, () -> seedService.seed(user(29049L), 1L, "A42", null, Map.of("regNo", "R-7", "regDate", "2025.03")));
        // 사원 29049 가 사원 202204180108329 의 행을 상신할 수 없다
        assertThrows(BusinessException.class, () -> seedService.seed(user(29049L), 1L, "A42", null,
                Map.of("ids", String.valueOf(TRANSPORT_FILE_ROW), "regNo", "R-7", "regDate", "2024.08")));
    }

    @Test
    void 영수증_파일은_결재문서에_한_번만_연결된다() {
        UserPrincipal u = user(202204180108329L);
        Integer before = jdbc.queryForObject("select count(*) from sys11_relate_file where sys11_parent_id = ? and sys11_parent_table = 'apr01_appr'", Integer.class, APPR);
        assertThat(fileService.linkReceiptFiles(u, List.of(TRANSPORT_FILE_ROW), APPR)).isGreaterThanOrEqualTo(0);
        Integer after = jdbc.queryForObject("select count(*) from sys11_relate_file where sys11_parent_id = ? and sys11_parent_table = 'apr01_appr'", Integer.class, APPR);
        assertThat(after).isGreaterThanOrEqualTo(before);
        // 두 번째는 이미 연결돼 있어 넣지 않는다
        assertThat(fileService.linkReceiptFiles(u, List.of(TRANSPORT_FILE_ROW), APPR)).isZero();
        Integer linked = jdbc.queryForObject("select count(*) from sys11_relate_file where sys11_file_id = 202408281930235 and sys11_parent_id = ? and sys11_parent_table = 'apr01_appr'", Integer.class, APPR);
        assertThat(linked).isEqualTo(1);
        // 남의 행은 연결할 수 없다
        assertThrows(BusinessException.class, () -> fileService.linkReceiptFiles(user(29049L), List.of(TRANSPORT_FILE_ROW), APPR));
        assertThrows(BusinessException.class, () -> fileService.linkReceiptFiles(u, List.of(), APPR));
    }
}
